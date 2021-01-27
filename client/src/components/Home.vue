<template>
	<v-container>
		<v-container>
			<v-layout mt-5>
				<v-row>
					<v-col
						cols="12"
						sm="6"
						class="d-flex flex-column align-center justify-center"
					>
						<h1>Megabooks</h1>
						<p>A top tier bookseller solution</p>
						<v-btn color="accent" x-large @click="$router.push('/register')"
							>Sign Up</v-btn
						>
					</v-col>
					<v-col cols="12" sm="6">
						<v-img src="../assets/undraw_book_lover_mkck.svg"></v-img>
					</v-col>
				</v-row>
			</v-layout>
		</v-container>

		<!-- Loading spinner -->
		<v-layout row>
			<v-dialog v-model="loading" persistent fullscreen>
				<v-container fill-height>
					<v-layout row justify-center align-center>
						<v-progress-circular
							indeterminate
							:size="70"
							width="7"
							color="secondary"
						></v-progress-circular>
					</v-layout>
				</v-container>
			</v-dialog>
		</v-layout>
	</v-container>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from "vuex";

export default {
	name: "Home",
	// execute when component is created
	created() {
		this.handleCustomers();
	},
	computed: {
		...mapGetters(["loading", "customers"]),
	},
	methods: {
		handleCustomers() {
			// getter from vuex
			this.$store.dispatch("getCustomers");
		},
	},
};
</script>

<style scoped>
.title {
	text-align: center;
}
</style>