this.manifest = {
    "name": "Markdownizr",
    "icon": "favicon.ico",
    "settings": [
        {
            "tab": "Options",
            "group": "Keep Elements",
            "name": "keep_elements",
            "type": "textarea",
            "text": "div, span, table, del, etc",
            "default": "table, small"
        },
        {
            "tab": "Options",
            "group": "Keep Elements",
            "name": "keep_desc",
            "type": "description",
            "text": "These elements will be preserved as raw HTML in the markdown output."
        },
        {
            "tab": "Options",
            "group": "Delete Elements",
            "name": "delete_elements",
            "type": "textarea",
            "text": "script, noscript, canvas, etc",
            "default": "script, style, title, noscript, canvas, embed, object, param, svg, source, iframe"
        },
        {
            "tab": "Options",
            "group": "Delete Elements",
            "name": "delete_desc",
            "type": "description",
            "text": "These elements **and their contents** will be removed from the markdown output."
        },
    ]
};
