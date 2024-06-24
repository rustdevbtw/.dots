const { GLib } = imports.gi;

// Import services
const hyprland = await Service.import("hyprland");
const audio = await Service.import("audio");
const battery = await Service.import("battery");
const net = await Service.import("network");

// Date and time variables
const dateVariable = Variable("", { poll: [1000, 'date "+%H:%M"'] });
const fulldateVariable = Variable("", { poll: [1000, 'date "+%H:%M:%S %b %e"'] });

// Network Indicator Widget
function NetworkIndicator() {
    return Widget.Button({
        class_name: "client-title",
        child: Widget.Label({
            label: net.wifi.bind('ssid').as(ssid => `${ssid || 'Unknown'}  `),
        }),
        onClicked: async () => {
            await Utils.execAsync("/bin/sh -c iwgtk");
        }
    });
}

// Workspace Widget
function Workspaces() {
    function WorkspaceButton(id) {
        const activeId = hyprland.active.workspace.bind("id");
        return Widget.Button({
            on_clicked: () => hyprland.messageAsync(`dispatch workspace ${id}`),
            child: Widget.Label({
                label: activeId.as(i => `${i === id ? "[*] " : ""}${id}`),
            }),
            class_name: activeId.as(i => `${i === id ? "focused" : ""}`),
        });
    }

    const workspaces = hyprland.bind("workspaces").as(ws => ws.map(({ id }) => WorkspaceButton(id)));

    return Widget.Box({
        class_name: "workspaces",
        children: workspaces,
    });
}

// Client Title Widget
function ClientTitle() {
    const title = hyprland.active.client.bind("title").as(title =>
        `${title.length > 25 ? title.slice(0, 25) + '...' : title.length > 0 ? title : 'None!'}`
    );
    return Widget.Button({
        class_name: "client-title",
        label: title,
    });
}

// Clock Widget
function Clock() {
    return Widget.Label({
        class_name: "clock",
        label: dateVariable.bind(),
        tooltipText: fulldateVariable.bind(),
    });
}

// Arch Label Widget
function Arch() {
    return Widget.Label({
        class_name: "arch",
        label: "󰣇",
        tooltipText: "(btw)"
    });
}

// Volume Control Widget
function Volume() {
    const icons = {
        101: "overamplified",
        67: "high",
        34: "medium",
        1: "low",
        0: "muted",
    };

    function getIcon() {
        const icon = audio.speaker.is_muted ? 0 : [101, 67, 34, 1, 0].find(
            threshold => threshold <= audio.speaker.volume * 100
        );

        return `audio-volume-${icons[icon]}-symbolic`;
    }

    const slider = Widget.Slider({
        class_name: "vol_slider",
        hexpand: true,
        draw_value: false,
        on_change: ({ value }) => audio.speaker.volume = value,
        value: audio.speaker.bind("volume"),
    });

    const icon = Widget.Icon({
        icon: Utils.watch(getIcon, audio.speaker, getIcon),
    });

    const icon_btn = Widget.Button({
        class_name: "vol_icon",
        child: icon,
        onClicked: async () => {
            try {
                await Utils.execAsync('/usr/bin/xdg-open "https://github.com/cdemoulins/pamixer"');
            } catch (e) {
                console.error("Error opening link:", e);
            }
        },
    });

    return Widget.Box({
        class_name: "volume",
        children: [
            slider,
            Widget.Label({ label: audio.speaker.bind("volume").as(v => `${Math.round(v * 100)}%`) }),
            icon_btn,
        ],
    });
}

// Battery Label Widget
function BatteryLabel() {
    const label = battery.bind("percent").as(p => `${p}% `);
    const icon = battery.bind("icon_name");
    return Widget.Box({
        class_name: "battery",
        visible: battery.bind("available"),
        children: [
            Widget.Label({ label }),
            Widget.Icon({ icon })
        ]
    }).hook(battery, self => {
        const charging = battery.charging;
        const timeRemaining = battery.time_remaining;
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor(timeRemaining / 60) - hours * 60;
        let tooltipText;

        if (charging) {
            tooltipText = `Charging`;
        } else if (!hours && minutes) {
            tooltipText = `${minutes}m remaining`;
        } else if (!minutes && hours) {
            tooltipText = `${hours}h remaining`;
        } else if (!minutes && !hours) {
            tooltipText = `Fully Charged!`;
        } else {
            tooltipText = `${hours}h ${minutes}m remaining`;
        }

        self.tooltip_text = tooltipText;
    });
}

// Tux Icon Widget
function Icon() {
    return Widget.Label({
        label: "  ",
        tooltipText: "Tux, the Great!",
        class_name: "icon",
    });
}

// Power Off Button Widget
function PowerOff() {
    return Widget.Button({
        label: " ⏻ ",
        class_name: "pw_icon",
        onClicked: async () => {
            await Utils.execAsync("/bin/sh -c poweroff");
        }
    });
}

// Weather Widget
function Weather(city = "Raiganj") {
    const d = Variable("Loading...");

    let stack = new Error().stack;
    let stackLine = stack.split('\n')[1];
    let scriptPathMatch = stackLine.match(/@(.+):\d+:\d+/);
    if (!scriptPathMatch) {
        throw new Error("Couldn't determine script path");
    }
    let scriptPath = scriptPathMatch[1];
    if (scriptPath.startsWith('file:///')) {
        scriptPath = scriptPath.substring(7);
    }
    let scriptDir = GLib.path_get_dirname(scriptPath);
    let resolvedPath = GLib.build_filenamev([scriptDir, "scripts/weather.sh"]);

    Utils.execAsync(`/bin/sh ${resolvedPath} "${city}"`).then(t => d.setValue(JSON.parse(t)["text"])).catch();

    return Widget.Button({
        label: d.bind(),
        class_name: "client-title",
        onClicked: async () => {
            try {
                await Utils.execAsync(`/usr/bin/xdg-open "https://wttr.in/${city}"`);
            } catch (e) {
                console.error("Error opening weather URL:", e);
            }
        }
    });
}

// Left Side of the Bar
function Left() {
    return Widget.Box({
        spacing: 8,
        children: [
            Icon(),
            Weather(),
            PowerOff(),
            Workspaces(),
            ClientTitle(),
        ],
    });
}

// Center of the Bar
function Center() {
    return Widget.Box({
        spacing: 8,
        children: [Arch()],
    });
}

// Right Side of the Bar
function Right() {
    return Widget.Box({
        hpack: "end",
        spacing: 8,
        children: [
            Volume(),
            NetworkIndicator(),
            BatteryLabel(),
            Clock(),
        ],
    });
}

// Main Bar Widget
function Bar(monitor = 0) {
    return Widget.Window({
        name: `bar-${monitor}`,
        class_name: "bar",
        monitor,
        anchor: ["top", "left", "right"],
        exclusivity: "exclusive",
        child: Widget.CenterBox({
            start_widget: Left(),
            center_widget: Center(),
            end_widget: Right(),
        }),
        heightRequest: 50
    });
}

// Application Configuration
App.config({
    windows: [
        Bar(),
        // Uncomment these lines for bars on multiple monitors
        // Bar(1),
        // Bar(2),
    ],
    style: './style.css',
    iconTheme: "breeze-cursors",
    gtkTheme: "catppuccin-frappe-sapphire-standard+default-dark"
});

export { };
