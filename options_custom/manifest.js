this.manifest = {
    "name": "Markdownizr",
    "icon": "icon.png",
    "settings": [
        {
            "tab": "Filters",
            "group": "Strip Elements",
            "name": "strip_elements",
            "type": "text",
            "text": "script, nav, p, ..."
        },
        {
            "tab": "Filters",
            "group": "Strip Elements",
            "name": "strip_desc",
            "type": "description",
            "text": "These elements will be removed from the generated markdown, but their content will be kept."
        },
        {
            "tab": "Filters",
            "group": "Delete Elements",
            "name": "delete_elements",
            "type": "text",
            "text": "script, nav, p, ..."
        },
        {
            "tab": "Filters",
            "group": "Delete Elements",
            "name": "delete_desc",
            "type": "description",
            "text": "These elements will **and their contents** will be removed from the generated markdown."
        },
        {
            "tab": "Pro Features",
            "group": "Readability",
            "name": "enable_readability",
            "type": "checkbox",
        },
        {
            "tab": "Pro Features",
            "group": "Readability",
            "name": "readability_api_key",
            "type": "text",
            "text": "XXXXXXXXXXXXXXXX",
            "masked": true
        },
        {
            "tab": "Pro Features",
            "group": "Readability",
            "name": "readability_desc",
            "type": "description",
            "text": "Enter your Parser API Key from <a href='https://www.readability.com/developers/api'>Readability</a>."
        }
    ]
};
