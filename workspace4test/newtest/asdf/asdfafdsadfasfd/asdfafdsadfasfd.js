/**
 * lazyLoadComponents([], Vue.resolvePath("statics/components"));
 * Vue.loadJS([ [ "vue-easy-lightbox", Vue.resolvePath("statics/plugins/vue-2.6.10/vue-easy-lightbox.umd.min.js") ] ]),
 * vue component: asdfafdsadfasfd 
 */
(function (Vue) {
	var COMPONENT_NAME = 'asdfafdsadfasfd';
	Vue.componentList[COMPONENT_NAME] =
		Promise.resolve({
			name: COMPONENT_NAME,
			props: {},
			computed: {},
			methods: {}
		});
})(window.Vue);