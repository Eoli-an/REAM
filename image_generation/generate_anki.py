import json
import os
import genanki

def collect_images(directory):
    images_dict = {}
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.png'):
                char = file[0]
                if char not in images_dict:
                    images_dict[char] = []
                images_dict[char].append(os.path.join(root, file))
    return images_dict

def main():
    base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static'))
    directories = [os.path.join(base_path, 'images'), os.path.join(base_path, 'images2'), os.path.join(base_path, 'images3')]

    images_dict = {}
    for directory in directories:
        dir_images = collect_images(directory)
        for char, paths in dir_images.items():
            if char not in images_dict:
                images_dict[char] = []
            images_dict[char].extend(paths)

    return images_dict

def read_jsonl(file_path):
    data = []
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            data.append(json.loads(line.strip()))
    return data

def collect_images_for_character(character, images_dict):
    return images_dict.get(character, [])

def generate_anki_notes(data, images_dict):
    notes = []
    media_files = set()
    
    for item in data:
        char = item["char"].strip()
        frequency = item["frequency"]
        definition = item["definition"]
        images = collect_images_for_character(char, images_dict)
        
        if not images:
            images = ["No images available"]
            tags = ["image_not_available"]
        else:
            media_files.update(images)
            tags = []

        note = genanki.Note(
            model=genanki.Model(
                1607392319,
                'Simple Model',
                fields=[
                    {'name': 'Images'},
                    {'name': 'Character'},
                    {'name': 'Frequency'},
                    {'name': 'Definition'},
                ],
                templates=[
                    {
                        'name': 'Card 1',
                        'qfmt': '{{Images}}',
                        'afmt': '''{{FrontSide}}<hr id="answer">
                                   <div style="font-size: 20px; margin-bottom: 10px;">{{Definition}}</div>
                                   <div style="font-size: 30px; margin-bottom: 10px;">{{Character}}</div>
                                   <div style="font-size: 15px; color: gray;">Frequency: {{Frequency}}</div>''',
                    },
                ]),
            fields=["<br>".join(f'<img src="{os.path.basename(image)}">' for image in images), char, str(frequency), definition],
            tags=tags
        )
        notes.append(note)
    
    return notes, list(media_files)

def create_anki_deck(notes, media_files, deck_name, output_file):
    deck = genanki.Deck(
        2059400110,
        deck_name
    )
    for note in notes:
        deck.add_note(note)

    package = genanki.Package(deck)
    package.media_files = media_files
    package.write_to_file(output_file)

if __name__ == "__main__":
    jsonl_file = "character_data.jsonl"  # Actual path to the JSONL file
    output_file = "output.apkg"  # Desired output file path
    
    images_dict = main()
    data = read_jsonl(jsonl_file)
    notes, media_files = generate_anki_notes(data, images_dict)
    create_anki_deck(notes, media_files, 'Chinese Characters', output_file)
