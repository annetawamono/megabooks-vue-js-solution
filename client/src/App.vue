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

			<v-app-bar-title v-if="user"
				>{{ user.name }} {{ user.surname }}</v-app-bar-title
			>

			<v-spacer></v-spacer>

			<router-link v-if="!user" to="/register">
				<v-btn text> Register </v-btn>
			</router-link>

			<router-link v-if="!user" to="/login">
				<v-btn text> Login </v-btn>
			</router-link>

			<router-link v-else to="/login">
				<v-btn text @click="handleSignOutUser"> Logout </v-btn>
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
import { mapGetters } from "vuex";

export default {
	name: "App",
	computed: {
		...mapGetters(["user"]),
	},
	methods: {
		handleSignOutUser() {
			this.$store.dispatch("signOutUser");
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