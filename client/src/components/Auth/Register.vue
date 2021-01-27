<template>
	<v-container text-xs-center mt-5 pt-5>
		<!-- Error Alert -->
		<v-layout v-if="error" row wrap>
			<v-flex xs12 sm4 offset-sm4>
				<form-alert :message="error.message"></form-alert>
			</v-flex>
		</v-layout>

		<!-- Sign up title -->
		<v-layout row wrap mb-5>
			<v-flex xs12 sm6 offset-sm4><h1>Register</h1></v-flex>
		</v-layout>

		<!-- Sign up form -->
		<v-layout row wrap>
			<v-flex xs12 sm6 offset-sm4>
				<v-container>
					<v-form
						:v-model="isFormValid"
						lazy-validation
						ref="form"
						@submit.prevent="handleSignUpUser"
					>
						<v-layout row>
							<v-flex xs12 sm7>
								<v-text-field
									v-model="name"
									:rules="nameRules"
									outlined
									label="Name"
									type="text"
									required
									clearable
								></v-text-field>
							</v-flex>
						</v-layout>

						<v-layout row>
							<v-flex xs12 sm7>
								<v-text-field
									v-model="surname"
									:rules="nameRules"
									outlined
									label="Surname"
									type="text"
									required
									clearable
								></v-text-field>
							</v-flex>
						</v-layout>

						<v-layout row>
							<v-flex xs12 sm7>
								<v-text-field
									v-model="email"
									:rules="emailRules"
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
									:rules="passwordRules"
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
								<v-text-field
									v-model="confirmPassword"
									:rules="passwordRules"
									outlined
									label="Confirm Password"
									:type="show2 ? 'text' : 'password'"
									:append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
									hint="At least 8 characters"
									counter
									required
									@click:append="show2 = !show2"
								></v-text-field>
							</v-flex>
						</v-layout>

						<v-layout row>
							<v-flex xs12 sm7>
								<v-btn
									color="accent"
									type="submit"
									:disabled="!isFormValid || loading"
									mb-5
									>Sign up</v-btn
								>
								<v-container mt-5>
									<p>
										Already have an account?
										<router-link to="/login">Login</router-link>
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
import { mapGetters } from "vuex";

export default {
	name: "Register",
	data() {
		return {
			isFormValid: true,
			show1: false,
			show2: false,
			name: "",
			surname: "",
			email: "",
			password: "",
			confirmPassword: "",
			nameRules: [
				(name) => !!name || "This field is required",
				(name) => {
					let reg = /[a-z|A-Z]+/;
					return reg.test(name) || "This field contains invalid characters.";
				},
			],
			emailRules: [
				(email) => !!email || "Email is required",
				(email) => {
					let reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
					return reg.test(email) || "Email is not valid";
				},
			],
			passwordRules: [
				(password) => !!password || "Password is required",
				(password) => password.length >= 8 || "Password must be greater than 8",
				(confirmation) =>
					confirmation === this.password || "Password should match",
			],
		};
	},
	computed: {
		...mapGetters(["error", "user", "loading"]),
	},
	watch: {
		// keep track of when user (state) changes
		user() {
			this.$router.push("/dashboard");
		},
	},
	methods: {
		handleSignUpUser() {
			if (this.$refs.form.validate()) {
				this.$store.dispatch("signUpUser", {
					name: this.name,
					surname: this.surname,
					email: this.email,
					password: this.password,
				});
			}
		},
	},
};
</script>