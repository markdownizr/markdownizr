this.manifest = {
    "name": "Markdownizr",
    "icon": "favicon.ico",
    "settings": [
        {
            "tab": "Options",
            "group": "Strip Elements",
            "name": "strip_elements",
            "type": "textarea",
            "text": "div, span, table, del, etc",
            "default": "div, span, small, aside, section, article, header, time, address"
        },
        {
            "tab": "Options",
            "group": "Strip Elements",
            "name": "strip_desc",
            "type": "description",
            "text": "These elements will be removed from the generated markdown, but their content will be kept."
        },
        {
            "tab": "Options",
            "group": "Delete Elements",
            "name": "delete_elements",
            "type": "textarea",
            "text": "script, noscript, canvas, etc",
            "default": "script, noscript, canvas, embed, object, param, svg, source, form, nav, iframe, footer, hgroup"
        },
        {
            "tab": "Options",
            "group": "Delete Elements",
            "name": "delete_desc",
            "type": "description",
            "text": "These elements will **and their contents** will be removed from the generated markdown."
        },
    ]
};
