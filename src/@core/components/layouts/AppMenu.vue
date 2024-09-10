<template>
	<div class="layout-menu-container">

		<AppSubmenu :items="model" class="layout-menu" :root="true" @menuitem-click="onMenuItemClick"
			@keydown="onKeyDown" />

	</div>
</template>

<script>
import AppSubmenu from './AppSubmenu';

export default {
	props: {
		model: Array
	},
	methods: {
		onMenuItemClick(event) {
			this.$emit('menuitem-click', event);
		},
		onKeyDown(event) {
			const nodeElement = event.target;
			if (event.code === 'Enter' || event.code === 'Space') {
				nodeElement.click();
				event.preventDefault();
			}
		},
		bannerImage() {
			return this.$appState.darkTheme ? 'images/banner-primeblocks-dark.png' : 'images/banner-primeblocks.png';
		}
	},
	computed: {
		darkTheme() {
			return this.$appState.darkTheme;
		}
	},
	components: {
		'AppSubmenu': AppSubmenu
	}
}
</script>
<style lang='scss'>
.layout-menu {

	.pi-id-card {
		font-size: 1.5rem;
		padding-left: 11px;
	}

	.pi-comment {
		font-size: 1.5rem;
		padding-left: 11px;
	}
}
</style>