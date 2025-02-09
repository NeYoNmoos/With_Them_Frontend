import { useEffect, useState } from "react";

interface Settings {
	maxPlayers: number;
	imposters: number;
}

type SettingsProps = {
	gameId: string;
	name: string;
};
export default function Settings({ gameId, name }: SettingsProps) {
	const [settings, setSettings] = useState<Settings>();
	const [fetchTrigger, setFetchTrigger] = useState(false);
	useEffect(() => {
		fetch("http://localhost:4000/settings/" + gameId, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => {
				console.log(response);
				if (!response.ok) {
					console.log(gameId);
					throw new Error("Failed to fetch settings");
				}
				return response.json();
			})
			.then((json) => {
				setSettings({
					maxPlayers: json.maxPlayers,
					imposters: json.imposters,
				});
			});
	}, [gameId, fetchTrigger]);

	function handleChange(id: string, e: any) {
		fetch(
			`http://localhost:4000/settings/${gameId}/${name}/${id}/${e.target.value}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			}
		).then((response) => {
			if (response.ok) {
				if (id === "maxPlayers") {
					setSettings({
						maxPlayers: e.target.value,
						imposters: settings?.imposters ?? 1,
					});
				}

				if (id === "imposters") {
					setSettings({
						maxPlayers: settings?.maxPlayers ?? 3,
						imposters: e.target.value,
					});
				}
			}
		});
		setFetchTrigger((prev) => !prev);
	}
	return (
		<div className="absolute top-10 left-20">
			<div key={"maxPlayers"}>
				<p className="text-white">Max Players</p>
				<input
					className="bg-black text-white"
					onChange={(e) => handleChange("maxPlayers", e)}
					type="number"
					value={settings?.maxPlayers ?? 3}
				></input>
			</div>

			<div key={"imposters"}>
				<p className="text-white">Imposters</p>
				<input
					className="bg-black text-white"
					onChange={(e) => handleChange("imposters", e)}
					type="number"
					value={settings?.imposters ?? 1}
				></input>
			</div>
		</div>
	);
}
