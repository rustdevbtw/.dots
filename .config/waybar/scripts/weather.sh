#!/usr/bin/env bash

for i in {1..5}; do
	text=$(curl -s "https://wttr.in/$1?format=1")
	if [[ $? == 0 ]]; then
		text=$(echo "$text" | sed -E "s/\s+/ /g")
		# When their server is heavily loaded, they return 200 OK on ?format=4 and say that the location is Unknown, while it isn't.
		if ! echo "$text" | grep -q "Unknown"; then
			tooltip=$(curl --fail-with-body -s "https://wttr.in/$1?format=4")
			if [[ $? == 0 ]]; then
				tooltip=$(echo "$tooltip" | sed -E "s/\s+/ /g")
				echo "{\"text\":\"$1 $text\", \"tooltip\":\"$tooltip\"}"
				exit
			else
				echo "{\"text\": \" Weather Not Found\", \"tooltip\": \"$tooltip\"}"
				exit
			fi
		fi
	fi
	sleep 2
done

echo "{\"text\":\"error\", \"tooltip\":\"error\"}"
