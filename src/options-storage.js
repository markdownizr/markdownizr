import OptionsSync from 'webext-options-sync';

window.optionsStorage = new OptionsSync({
	defaults: {
		keepElements: '',
		deleteElements: 'script, style, title, noscript, canvas, embed, object, param, svg, source, iframe',
	},
	migrations: [],
	logging: true
})
