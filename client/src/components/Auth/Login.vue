<template>
	<v-container text-xs-center mt-5 pt-5>
		<!-- Sign in title -->
		<v-layout row wrap mb-5>
			<v-flex xs12 sm6 offset-sm4><h1>Login</h1></v-flex>
		</v-layout>

		<!-- Sign in form -->
		<v-layout row wrap>
			<v-flex xs12 sm6 offset-sm4>
				<v-container>
					<v-form @submit.prevent="handleSignInUser">
						<v-layout row>
							<v-flex xs12 sm7>
								<v-text-field
									v-model="email"
									outlined
									label="Email"
									type="email"
									required
									clearable
								></v-text-field>
							</v-flex>
						</v-layout>
						<v-layout row>
							<v-flex xs12 sm7>
								<v-text-field
									v-model="password"
									outlined
									label="Password"
									:type="show1 ? 'text' : 'password'"
									:append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
									hint="At least 8 characters"
									counter
									required
									@click:append="show1 = !show1"
								></v-text-field>
							</v-flex>
						</v-layout>
						<v-layout row>
							<v-flex xs12 sm7>
								<v-btn color="accent" type="submit" mb-5>Sign in</v-btn>
								<v-container mt-5>
									<p>
										Don't have an account?
										<router-link to="/register">Register</router-link>
									</p>
								</v-container>
							</v-flex>
						</v-layout>
					</v-form>
				</v-container>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
// import { mdiEmail } from "@mdi/js";
import { mapGetters } from "vuex";

export default {
	name: "Login",
	data() {
		return {
			show1: false,
			email: "",
			password: "",
		};
	},
	computed: {
		...mapGetters(["user"]),
	},
	watch: {
		// keep track of when user (state) changes
		user() {
			this.$router.push("/dashboard");
		},
	},
	methods: {
		handleSignInUser() {
			this.$store.dispatch("signInUser", {
				email: this.email,
				password: this.password,
			});
		},
	},
};
</script>