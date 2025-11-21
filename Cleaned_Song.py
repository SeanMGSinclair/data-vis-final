import pandas as pd

df = pd.read_csv("dataset.csv")
initial_rows = len(df)

unnamed_cols = df.columns[df.columns.str.contains("^Unnamed")]
df = df.loc[:, ~df.columns.str.contains("^Unnamed")]
print(f"Removed {len(unnamed_cols)} unnamed columns: {list(unnamed_cols)}")

before_dupes = len(df)
df = df.drop_duplicates(subset=["track_name", "artists"])
after_dupes = len(df)
print(f"Duplicate rows removed: {before_dupes - after_dupes}")

df["track_genre"] = df["track_genre"].astype(str).str.lower()

genre_mapping = {
    # Pop
    "pop": "Pop",
    "k-pop": "Pop",
    "indie-pop": "Pop",
    "synth-pop": "Pop",
    "power-pop": "Pop",
    "pop-film": "Pop",
    "cantopop": "Pop",
    "mandopop": "Pop",
    "j-pop": "Pop",
    "j-idol": "Pop",

    # Rock & Alternative
    "rock": "Rock & Alternative",
    "alt-rock": "Rock & Alternative",
    "hard-rock": "Rock & Alternative",
    "punk": "Rock & Alternative",
    "punk-rock": "Rock & Alternative",
    "emo": "Rock & Alternative",
    "grunge": "Rock & Alternative",
    "garage": "Rock & Alternative",
    "psych-rock": "Rock & Alternative",
    "industrial": "Rock & Alternative",
    "metal": "Rock & Alternative",
    "hardcore": "Rock & Alternative",
    "rockabilly": "Rock & Alternative",
    "j-rock": "Rock & Alternative",
    "goth": "Rock & Alternative",
    "heavy-metal": "Rock & Alternative",
    "death-metal": "Rock & Alternative",
    "metalcore": "Rock & Alternative",
    "black-metal": "Rock & Alternative",
    "grindcore": "Rock & Alternative",
    "rock-n-roll": "Rock & Alternative",
    "alternative": "Rock & Alternative",
    "british": "Rock & Alternative",

    # Dance & Electronic
    "dance": "Dance & Electronic",
    "edm": "Dance & Electronic",
    "electro": "Dance & Electronic",
    "electronic": "Dance & Electronic",
    "techno": "Dance & Electronic",
    "house": "Dance & Electronic",
    "deep-house": "Dance & Electronic",
    "progressive-house": "Dance & Electronic",
    "minimal-techno": "Dance & Electronic",
    "detroit-techno": "Dance & Electronic",
    "club": "Dance & Electronic",
    "dubstep": "Dance & Electronic",
    "trance": "Dance & Electronic",
    "trip-hop": "Dance & Electronic",
    "drum-and-bass": "Dance & Electronic",
    "idm": "Dance & Electronic",
    "breakbeat": "Dance & Electronic",

    # Hip-hop
    "hip-hop": "Hip-hop",
    "r-n-b": "Hip-hop",
    "soul": "Hip-hop",
    "funk": "Hip-hop",
    "groove": "Hip-hop",

    # Latin
    "latin": "Latin",
    "latino": "Latin",
    "spanish": "Latin",
    "reggaeton": "Latin",
    "salsa": "Latin",
    "samba": "Latin",
    "brazil": "Latin",
    "mpb": "Latin",
    "forro": "Latin",
    "pagode": "Latin",

    # Folk & Country
    "folk": "Folk & Country",
    "country": "Folk & Country",
    "bluegrass": "Folk & Country",
    "honky-tonk": "Folk & Country",

    # Jazz & Blues
    "jazz": "Jazz & Blues",
    "blues": "Jazz & Blues",

    # Classical
    "classical": "Classical",
    "opera": "Classical",


    # Acoustic & Singer-songwriter
    "acoustic": "Acoustic & Singer-songwriter",
    "piano": "Acoustic & Singer-songwriter",
    "singer-songwriter": "Acoustic & Singer-songwriter",
    "songwriter": "Acoustic & Singer-songwriter",
    "guitar": "Acoustic & Singer-songwriter",

    # Chill & Ambient
    "chill": "Chill & Ambient",
    "ambient": "Chill & Ambient",
    "sleep": "Chill & Ambient",
    "study": "Chill & Ambient",
    "new-age": "Chill & Ambient",

    # World
    "indian": "World",
    "turkish": "World",
    "iranian": "World",
    "german": "World",
    "french": "World",
    "swedish": "World",
    "malay": "World",
    "world-music": "World",
    "afrobeat": "World",
    "tango": "World",

    # Reggae & Dub
    "reggae": "Reggae & Dub",
    "dub": "Reggae & Dub",
    "dancehall": "Reggae & Dub",

    #Children
    "children": "Children",
    "kids": "Children",
    "disney": "Children",
    "comedy": "Children",

    # Show Tunes
    "show-tunes": "Show Tunes",

    # Other
    "anime": "Other",
    "party": "Other",
    "happy": "Other",
    "romance": "Other",
    "chicago-house": "Other",
    "indie": "Other"
}

def map_genre(raw_genre):
    for key in genre_mapping:
        if key in raw_genre:
            return genre_mapping[key]
    return "Other"

df["track_genre"] = df["track_genre"].apply(map_genre)

columns_to_use = [
    "track_name", "artists", "track_genre",
    "popularity", "danceability", "energy", "loudness", "mode", "speechiness",
    "acousticness", "instrumentalness", "liveness", "valence", "tempo"
]

final_df = df[columns_to_use]

before_na = len(final_df)
final_df = final_df.dropna()
after_na = len(final_df)
print(f"Rows with missing values removed: {before_na - after_na}")


numeric_cols = [
    "popularity", "danceability", "energy", "loudness", "mode", "speechiness",
    "acousticness", "instrumentalness", "liveness", "valence", "tempo"
]

for col in numeric_cols:
    mean = final_df[col].mean()
    std = final_df[col].std()
    lower_bound = mean - 3 * std
    upper_bound = mean + 3 * std
    final_df = final_df[(final_df[col] >= lower_bound) & (final_df[col] <= upper_bound)]

print(f"Total rows remaining: {len(final_df)}")

final_df.to_csv("song.csv", index=False)
print("Cleaned dataset saved as song.csv")
