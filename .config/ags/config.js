import { Launcher } from "./others/launcher.js"

var AGS_LOGO_SYMBOL = "";

// Try to detect the OS
try {
  let data = {};
  var id;
  const contents = Utils.readFile('/etc/os-release');
  const lines = contents.split("\n");
  for (const line of lines) {
    const [k, v] = line.split("=");
    data[k] = v;
  }
  function logo() {
    if (id = data["ID"]) {
      switch (id) {
        case 'arch': return "";  // Arch Linux
        case 'debian': return ""; // Debian
        case 'ubuntu': return ""; // Ubuntu
        case 'fedora': return ""; // Fedora
        case 'centos': return ""; // CentOS
        case 'redhat': return ""; // Red Hat
        case 'suse': return "";  // openSUSE
        case 'opensuse': return ""; // openSUSE
        case 'manjaro': return ""; // Manjaro
        case 'solus': return "";  // Solus
        case 'gentoo': return ""; // Gentoo
        case 'nixos': return ""; // NixOS
        case 'slackware': return ""; // Slackware
        case 'mageia': return ""; // Mageia
        case 'linuxmint': return ""; // Linux Mint
        case 'elementary': return ""; // Elementary OS
        case 'zorin': return ""; // Zorin OS
        case 'deepin': return ""; // Deepin
        case 'parrot': return ""; // Parrot OS
        case 'kali': return ""; // Kali Linux
        case 'sabayon': return ""; // Sabayon
        case 'artix': return ""; // Artix Linux
        case 'endeavouros': return ""; // EndeavourOS
        case 'alpine': return ""; // Alpine Linux
        case 'rhel': return ""; // Red Hat Enterprise Linux
        case 'openmandriva': return ""; // OpenMandriva
        case 'puppy': return ""; // Puppy Linux
        case 'parabola': return ""; // Parabola
        case 'bedrock': return "b"; // Bedrock Linux
        case 'hyperbola': return ""; // Hyperbola
        case 'tumbleweed': return ""; // openSUSE Tumbleweed
        case 'cbl': return ""; // CBL
        case 'mx': return ""; // MX Linux
        default: return ""; // Default symbol
      }
    }
  }
  AGS_LOGO_SYMBOL = logo() || "";
} catch (err) {
  undefined;
}

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

// LogoSymbol Label Widget
function LogoSymbol() {
  return Widget.Label({
    class_name: "logo-symbol",
    label: AGS_LOGO_SYMBOL,
    tooltipText: "(btw)",
    widthRequest: 32
  });
}


function SoundBar() {
  return Widget.Slider({
    value: audio.speaker.bind("volume"),
    drawValue: false,
    hexpand: true,
    onChange: ({ value }) => audio.speaker.volume = value,
    class_name: "vol_slider",
  })
}

// Volume Control Widget
function Volume() {
  const is_visible = Variable(false);
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

  const icon = Widget.Icon().hook(audio.speaker, s => {
    s.icon = getIcon();
  });

  const icon_btn = Widget.Button({
    class_name: "vol_icon",
    child: icon,
    onClicked: async () => {
      try {
        is_visible.setValue(!is_visible.getValue());
      } catch (e) {
        console.error("Error opening link:", e);
      }
    },
  });

  const bar = SoundBar();

  return Widget.Box({
    class_name: "volume",
    children: [
      bar,
      Widget.Label({ label: audio.speaker.bind("volume").as(v => `${Math.round(v * 100)}%`) }),
      icon_btn,
    ],
  }).hook(is_visible, s => {
    s.children[0].set_visible(is_visible.getValue());
    s.children[1].set_visible(is_visible.getValue());
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
function Left0() {
  return Widget.Box({
    spacing: 8,
    children: [
      Icon(),
      Weather(),
      PowerOff(),
    ],
    class_name: "left0"
  });
}


// Left Side of the Bar
function Left1() {
  return Widget.Box({
    spacing: 8,
    children: [
      Workspaces(),
      ClientTitle(),
    ],
    class_name: "left1"
  });
}

// Left Side of the Bar
function Left() {
  return Widget.Box({
    spacing: 8,
    children: [
      Left0(),
      Left1()
    ],
    class_name: "left"
  });
}

// Center of the Bar
function Center() {
  return Widget.Box({
    spacing: 8,
    children: [LogoSymbol()],
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
    class_name: "right"
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
    Launcher(),
  ],
  style: './style.css',
  iconTheme: "breeze-cursors",
  gtkTheme: "catppuccin-frappe-sapphire-standard+default-dark"
});

export { };
