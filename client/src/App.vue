<template>
	<v-app>
		<!-- Navbar -->
		<v-app-bar fixed color="primary" dark app>
			<v-app-bar-title>
				<router-link to="/" tag="span" style="cursor: pointer">
					Megabooks
				</router-link>
			</v-app-bar-title>

			<v-spacer></v-spacer>

			<router-link to="/register">
				<v-btn text> Register </v-btn>
			</router-link>

			<router-link to="/login">
				<v-btn text> Login </v-btn>
			</router-link>
		</v-app-bar>

		<!-- App content -->
		<v-main>
			<transition name="fade">
				<router-view />
			</transition>
		</v-main>
	</v-app>
</template>

<script>
export default {
	name: "App",
	comupted: {
		horizontalNavItems() {
			return [
				{ icon: "create", title: "Register", link: "/register" },
				{ icon: "lock_open", title: "Login", link: "/register" },
			];
		},
	},
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
	transition-property: all;
	transition-duration: 0.25s;
}

.fade-enter-active {
	transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
	transform: translateX(-25px);
}
</style>