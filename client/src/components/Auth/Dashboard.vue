<template>
	<v-container mt-5>
		<v-layout row>
			<v-flex>
				<h1>Dashboard</h1>
			</v-flex>
		</v-layout>

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

		<v-layout mt-5>
			<v-flex xs12>
				<v-card>
					<v-card-title>
						Customers
						<v-spacer></v-spacer>
						<v-text-field
							v-model="search"
							append-icon="mdi-magnify"
							label="Search"
							single-line
							hide-details
						></v-text-field>
					</v-card-title>
					<v-data-table
						:headers="headersCustomers"
						:items="customers"
						:search="search"
					></v-data-table>
				</v-card>
			</v-flex>
		</v-layout>

		<!-- <v-data-table
			:search="search"
			:headers="headers"
			:items="desserts"
			sort-by="calories"
			class="elevation-1 mt-5"
		> -->
		<!-- <template v-slot:top>
				<v-toolbar flat>
					
					<v-text-field
						v-model="search"
						append-icon="mdi-magnify"
						label="Search"
						single-line
						hide-details
					></v-text-field>
					<v-spacer></v-spacer>
					<v-dialog v-model="dialog" max-width="500px">
						
						<v-card>
							<v-card-title>
								<span class="headline">{{ formTitle }}</span>
							</v-card-title>

							<v-card-text>
								<v-container>
									<v-row>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedItem.name"
												label="Dessert name"
											></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedItem.calories"
												label="Calories"
											></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedItem.fat"
												label="Fat (g)"
											></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedItem.carbs"
												label="Carbs (g)"
											></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model="editedItem.protein"
												label="Protein (g)"
											></v-text-field>
										</v-col>
									</v-row>
								</v-container>
							</v-card-text>

							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="blue darken-1" text @click="close">
									Cancel
								</v-btn>
								<v-btn color="blue darken-1" text @click="save"> Save </v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
					<v-dialog v-model="dialogDelete" max-width="500px">
						<v-card>
							<v-card-title class="headline"
								>Are you sure you want to delete this item?</v-card-title
							>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="blue darken-1" text @click="closeDelete"
									>Cancel</v-btn
								>
								<v-btn color="blue darken-1" text @click="deleteItemConfirm"
									>OK</v-btn
								>
								<v-spacer></v-spacer>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-toolbar>
			</template>
			<template v-slot:item.actions="{ item }">
				<v-icon small @click="newItem(item)"> mdi-plus </v-icon>
				<v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
				<v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
			</template>
			<template v-slot:no-data>
				<v-btn color="primary" @click="initialize"> Reset </v-btn>
			</template>
		</v-data-table> -->
	</v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "Dashboard",
	// execute when component is created
	created() {
		this.handleCustomers();
		this.initialize();
	},
	data() {
		return {
			search: "",
			headersCustomers: [
				{ text: "Name", value: "name", align: "start" },
				{ text: "Surname", value: "surname" },
				{ text: "Email", value: "email", sortable: false },
				{ text: "Phone #", value: "phone", sortable: false },
				{ text: "Book Description", value: "bookDescription", sortable: false },
				{ text: "Book Price (R)", value: "bookPrice", sortable: false },
				{ text: "Purchase Date", value: "purchaseDate" },
				{ text: "ISBN", value: "isbn", sortable: false },
				{ text: "Actions", value: "actions", sortable: false },
			],
			dialog: false,
			dialogDelete: false,
			headers: [
				{
					text: "Dessert (100g serving)",
					align: "start",
					sortable: false,
					value: "name",
				},
				{ text: "Calories", value: "calories" },
				{ text: "Fat (g)", value: "fat" },
				{ text: "Carbs (g)", value: "carbs" },
				{ text: "Protein (g)", value: "protein" },
				{ text: "Actions", value: "actions", sortable: false },
			],
			desserts: [],
			editedIndex: -1,
			editedItem: {
				name: "",
				calories: 0,
				fat: 0,
				carbs: 0,
				protein: 0,
			},
			defaultItem: {
				name: "",
				calories: 0,
				fat: 0,
				carbs: 0,
				protein: 0,
			},
		};
	},
	computed: {
		...mapGetters(["loading", "customers"]),
		formTitle() {
			return this.editedIndex === -1 ? "New Item" : "Edit Item";
		},
	},
	watch: {
		dialog(val) {
			val || this.close();
		},
		dialogDelete(val) {
			val || this.closeDelete();
		},
	},
	methods: {
		handleCustomers() {
			// getter from vuex
			this.$store.dispatch("getCustomers");
		},
		initialize() {
			this.desserts = [
				{
					name: "Frozen Yogurt",
					calories: 159,
					fat: 6.0,
					carbs: 24,
					protein: 4.0,
				},
				{
					name: "Ice cream sandwich",
					calories: 237,
					fat: 9.0,
					carbs: 37,
					protein: 4.3,
				},
				{
					name: "Eclair",
					calories: 262,
					fat: 16.0,
					carbs: 23,
					protein: 6.0,
				},
				{
					name: "Cupcake",
					calories: 305,
					fat: 3.7,
					carbs: 67,
					protein: 4.3,
				},
				{
					name: "Gingerbread",
					calories: 356,
					fat: 16.0,
					carbs: 49,
					protein: 3.9,
				},
				{
					name: "Jelly bean",
					calories: 375,
					fat: 0.0,
					carbs: 94,
					protein: 0.0,
				},
				{
					name: "Lollipop",
					calories: 392,
					fat: 0.2,
					carbs: 98,
					protein: 0,
				},
				{
					name: "Honeycomb",
					calories: 408,
					fat: 3.2,
					carbs: 87,
					protein: 6.5,
				},
				{
					name: "Donut",
					calories: 452,
					fat: 25.0,
					carbs: 51,
					protein: 4.9,
				},
				{
					name: "KitKat",
					calories: 518,
					fat: 26.0,
					carbs: 65,
					protein: 7,
				},
			];
		},
		newItem(item) {
			this.editedIndex = -1;
			this.editedItem = Object.assign({}, item);
			this.dialog = true;
		},
		editItem(item) {
			this.editedIndex = this.desserts.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog = true;
		},

		deleteItem(item) {
			this.editedIndex = this.desserts.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialogDelete = true;
		},

		deleteItemConfirm() {
			this.desserts.splice(this.editedIndex, 1);
			this.closeDelete();
		},

		close() {
			this.dialog = false;
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
		},

		closeDelete() {
			this.dialogDelete = false;
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			});
		},

		save() {
			if (this.editedIndex > -1) {
				Object.assign(this.desserts[this.editedIndex], this.editedItem);
			} else {
				this.desserts.push(this.editedItem);
			}
			this.close();
		},
	},
};
</script>