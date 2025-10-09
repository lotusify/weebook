import re

def remove_duplicates():
    """Remove duplicate entries from data.js"""
    
    # Read data.js file
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all book entries with their IDs and titles
    book_entries = re.findall(r'(\d+):\s*\{[^}]*?title:\s*"([^"]+)"[^}]*?\}', content, re.DOTALL)

    print(f"Found {len(book_entries)} book entries")

    # Track seen titles and their first occurrence
    seen_titles = {}
    duplicate_ids = []

    for book_id, title in book_entries:
        if title in seen_titles:
            duplicate_ids.append(book_id)
            print(f"Duplicate: ID {book_id} - '{title}' (first seen at ID {seen_titles[title]})")
        else:
            seen_titles[title] = book_id

    print(f"Found {len(duplicate_ids)} duplicate entries to remove")

    # Remove duplicate entries
    for duplicate_id in duplicate_ids:
        # Find the book entry for this ID
        pattern = rf'{duplicate_id}:\s*\{{[^}}]*?\}},?'
        content = re.sub(pattern, '', content, flags=re.DOTALL)

    # Clean up extra commas and formatting
    content = re.sub(r',\s*,', ',', content)  # Remove double commas
    content = re.sub(r',\s*}', '}', content)  # Remove trailing commas before }

    # Write back to file
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(content)

    print("Duplicates removed successfully!")
    print(f"Remaining unique books: {len(seen_titles)}")

if __name__ == "__main__":
    remove_duplicates()
