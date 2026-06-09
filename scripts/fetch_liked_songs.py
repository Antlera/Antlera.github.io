#!/usr/bin/env python3
"""Fetch the first N tracks of a public NetEase Cloud Music playlist and write
them to _data/playlist_tracks.json for the playground "songs" section.

Public playlist only — no login/cookie required. If the fetch fails the
existing data file is left untouched (so a CI hiccup never blanks the page).

Usage: python3 scripts/fetch_liked_songs.py [playlist_id] [count]
"""
import json
import os
import sys
import urllib.request

PLAYLIST_ID = sys.argv[1] if len(sys.argv) > 1 else "436513472"
COUNT = int(sys.argv[2]) if len(sys.argv) > 2 else 10
OUT = os.path.join(os.path.dirname(__file__), "..", "_data", "playlist_tracks.json")

API = f"https://music.163.com/api/v3/playlist/detail?id={PLAYLIST_ID}&n={COUNT}"
HEADERS = {
    "Referer": "https://music.163.com",
    "User-Agent": "Mozilla/5.0",
    "Cookie": "os=pc",
}


def https(url: str) -> str:
    """Force https + a small thumbnail so we never serve mixed content."""
    url = url.replace("http://", "https://")
    sep = "&" if "?" in url else "?"
    return f"{url}{sep}param=160y160"


def main() -> int:
    req = urllib.request.Request(API, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.load(resp)

    if data.get("code") != 200 or "playlist" not in data:
        print(f"unexpected response: code={data.get('code')}", file=sys.stderr)
        return 1

    pl = data["playlist"]
    tracks = []
    for t in pl.get("tracks", [])[:COUNT]:
        tracks.append({
            "title": t["name"],
            "artist": " / ".join(a["name"] for a in t.get("ar", [])),
            "cover": https(t["al"]["picUrl"]),
            "url": f"https://music.163.com/song?id={t['id']}",
        })

    if not tracks:
        print("no tracks parsed", file=sys.stderr)
        return 1

    out = {
        "playlist_id": str(PLAYLIST_ID),
        "playlist_url": f"https://music.163.com/playlist?id={PLAYLIST_ID}",
        "tracks": tracks,
    }
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"wrote {len(tracks)} tracks to {os.path.relpath(OUT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
