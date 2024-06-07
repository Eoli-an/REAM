import os
import json

def collect_images(directory):
    images_dict = {}
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.png'):
                char = file[0]
                if char not in images_dict:
                    images_dict[char] = []
                # only add the path relative to the base directory
                images_dict[char].append(os.path.join('\\',os.path.basename(directory), file))
    return images_dict

def main():
    base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static'))
    directories = [os.path.join(base_path, 'images'), os.path.join(base_path, 'images2')]

    images_dict = {}
    for directory in directories:
        dir_images = collect_images(directory)
        for char, paths in dir_images.items():
            if char not in images_dict:
                images_dict[char] = []
            images_dict[char].extend(paths)

    output_path = os.path.join(base_path, 'images.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(images_dict, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    main()
