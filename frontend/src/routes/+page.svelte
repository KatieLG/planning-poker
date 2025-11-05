<script lang="ts">
	let joinRoomId = '';

	const createRoom = () => {
		// TODO: create a room and join
		console.log('Creating room...');
	};

	const joinRoom = () => {
		// TODO: join existing room
		console.log(`Joining room: ${joinRoomId}`);
	};
</script>

<svelte:head>
	<title>Planning Poker</title>
</svelte:head>

<div class="hero min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold mb-8">Planning Poker</h1>

			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title justify-center mb-4">Get Started</h2>

					<button class="btn btn-primary btn-lg mb-4" on:click={createRoom}>
						Create New Room
					</button>

					<div class="divider">OR</div>

					<div class="form-control">
						<label class="label" for="roomId">
							<span class="label-text pr-1">Enter Room ID</span>
						</label>
						<div class="join">
							<input
								id="roomId"
								type="text"
								placeholder="Room ID"
								class="input input-bordered join-item flex-1"
								bind:value={joinRoomId}
								on:keypress={(e) => e.key === 'Enter' && joinRoom()}
							/>
							<button class="btn btn-secondary join-item" on:click={joinRoom}> Join </button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
