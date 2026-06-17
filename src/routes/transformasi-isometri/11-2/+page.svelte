<script lang="ts">
	import LessonShell from '$lib/transformasi/LessonShell.svelte';
	import LatihanShell from '$lib/transformasi/LatihanShell.svelte';
	import FigureCard from '$lib/transformasi/FigureCard.svelte';
	import Stage from '$lib/transformasi/Stage.svelte';
	import Figure from '$lib/transformasi/Figure.svelte';
	import SlideToOverlay from '$lib/transformasi/SlideToOverlay.svelte';
	import VectorStepper from '$lib/transformasi/VectorStepper.svelte';
	import VectorArrow from '$lib/transformasi/VectorArrow.svelte';
	import ColumnVector from '$lib/transformasi/ColumnVector.svelte';
	import { anchor, translate, type Shape, type Vector } from '$lib/transformasi/geometry';
	import { toPx, toPxShape, toCartesian, snap, clamp } from '$lib/transformasi/grid';
	import {
		pairs as vqPairs,
		initialState,
		submitAnswer,
		nextPair,
		currentPair,
		correctAnswer,
		isAnswered,
		isCorrect,
		isLast
	} from '$lib/transformasi/vectorQuiz';

	// The object, and its image produced purely by the geometry seam. Authoring the
	// image as translate(objek, …) keeps the picture on screen equal to the function
	// the slide-to-overlay animates, so visual and geometry cannot drift.
	const objek: Shape = {
		points: [
			{ x: 18, y: 28 },
			{ x: 58, y: 38 },
			{ x: 50, y: 82 },
			{ x: 14, y: 66 }
		]
	};
	const translasi: Vector = { dx: 112, dy: 0 };
	const imej: Shape = translate(objek, translasi);

	let moved = $state(false);

	// Beat 2 — Vektor translasi (the Explorable). The Object is fixed, authored in
	// Cartesian (signed (x, y), y up) and mapped through toPx just before drawing,
	// so the y-flip lives in the grid seam and b = +y reads upward (ADR-0009).
	const objekCartes: Shape = {
		points: [
			{ x: -4, y: 1 },
			{ x: -1, y: 3 },
			{ x: -2, y: -2 },
			{ x: -5, y: -1 }
		]
	};
	const objekPx: Shape = toPxShape(objekCartes);

	// The Translation vector is the single source of truth: one $state rune the
	// stepper writes (clamped so the Image can never leave the grid). The Image,
	// arrow, and (a over b) readout all derive from it, so cause and effect — and
	// the notation — move in lockstep and cannot drift.
	let vektor = $state<Vector>(clamp({ dx: 3, dy: 2 }, objekCartes));

	function setVektor(next: Vector) {
		vektor = clamp(next, objekCartes);
	}

	// Effect: the Image is the geometry seam applied live, then mapped to px.
	const imejCartes = $derived(translate(objekCartes, vektor));
	const imejPx = $derived(toPxShape(imejCartes));

	// The arrow runs from the Object's anchor to anchor + vector, in px. The anchor
	// comes from the geometry seam, the same point translationVector measures from.
	const anchorCartes = anchor(objekCartes);
	const arrowFrom = $derived(toPx(anchorCartes));
	const arrowTo = $derived(toPx({ x: anchorCartes.x + vektor.dx, y: anchorCartes.y + vektor.dy }));

	// Dragging the arrowhead writes the very same rune the steppers write, so the
	// two controls can never disagree. The pointer's screen px is mapped into the
	// <Stage>'s coordinate space (DOM/SVG plumbing), then handed to grid.ts to be
	// turned into a snapped integer grid point — no geometry math is reinvented
	// here. The arrowhead's grid point is anchor + vector, so the vector it writes
	// is that point minus the anchor; setVektor clamps it onto the −6…+6 grid.
	let dragging = $state(false);

	function pointerToVector(event: PointerEvent): Vector {
		const handle = event.currentTarget as SVGGraphicsElement;
		const screen = handle.ownerSVGElement?.getScreenCTM();
		if (!screen) return vektor;
		const local = new DOMPoint(event.clientX, event.clientY).matrixTransform(screen.inverse());
		const tip = snap(toCartesian({ x: local.x, y: local.y }));
		return { dx: tip.x - anchorCartes.x, dy: tip.y - anchorCartes.y };
	}

	function onHandleDown(event: PointerEvent) {
		dragging = true;
		(event.currentTarget as Element).setPointerCapture(event.pointerId);
	}

	function onHandleMove(event: PointerEvent) {
		if (!dragging) return;
		setVektor(pointerToVector(event));
	}

	function onHandleUp(event: PointerEvent) {
		dragging = false;
		(event.currentTarget as Element).releasePointerCapture(event.pointerId);
	}

	// Arrow keys nudge the arrowhead by one grid unit, so the knob is operable
	// without a pointer; it writes the same rune (clamped) as drag and steppers.
	const nudges: Record<string, Vector> = {
		ArrowRight: { dx: 1, dy: 0 },
		ArrowLeft: { dx: -1, dy: 0 },
		ArrowUp: { dx: 0, dy: 1 },
		ArrowDown: { dx: 0, dy: -1 }
	};

	function onHandleKey(event: KeyboardEvent) {
		const nudge = nudges[event.key];
		if (!nudge) return;
		event.preventDefault();
		setVektor({ dx: vektor.dx + nudge.dx, dy: vektor.dy + nudge.dy });
	}

	// Beat 3 — Latihan (find the vector). The reverse drill: shown an objek and its
	// imej on the grid, the student enters the vektor translasi with the same
	// stepper, commits, and watches the slide-to-overlay confirm it. Interaction
	// lives in the pure vectorQuiz state machine; the page holds the snapshot and
	// the in-progress guess, and reads everything else as derived view-state.
	let quiz = $state(initialState(vqPairs));
	let guess = $state<Vector>({ dx: 0, dy: 0 });

	const vqPair = $derived(currentPair(quiz));
	const vqAnswered = $derived(isAnswered(quiz));
	const vqCorrect = $derived(isCorrect(quiz));
	const vqLast = $derived(isLast(quiz));
	const vqAnswer = $derived(correctAnswer(vqPair));

	// The pair drawn on the grid: both figures mapped Cartesian → px (ADR-0009).
	// The slide-to-overlay derives its motion from these two px figures, so the
	// "why" always slides along the genuine translation.
	const vqObjekPx = $derived(toPxShape(vqPair.objek));
	const vqImejPx = $derived(toPxShape(vqPair.imej));

	function submitGuess() {
		quiz = submitAnswer(quiz, guess);
	}

	function advancePair() {
		quiz = nextPair(quiz);
		guess = { dx: 0, dy: 0 };
	}
</script>

<LessonShell
	number="11.2"
	title="Translasi"
	description="Bahagian 11.2: translasi — menggelongsorkan setiap titik objek jarak yang sama dalam arah yang sama."
	prev={{ href: '/transformasi-isometri/11-1', label: '← 11.1 Transformasi dan Kekongruenan' }}
>
	<!-- Beat 1 — Translasi (concept): every point moves the same (a, b), and a
	     translation preserves shape, size, AND orientation — the property that
	     later distinguishes it from reflection. No coordinate grid here yet. -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Translasi</h2>
		<p class="leading-relaxed">
			<strong>Translasi</strong> ialah transformasi yang menggelongsorkan setiap titik objek jarak
			yang sama dalam arah yang sama. Setiap titik beralih mengikut anjakan
			<strong>(a, b)</strong> yang serupa — <em>a</em> unit ke kiri atau kanan, dan
			<em>b</em> unit ke atas atau ke bawah.
		</p>
		<p class="leading-relaxed">
			Oleh kerana seluruh rajah bergerak sebagai satu, translasi mengekalkan bentuk, saiz, dan
			<strong>orientasi</strong> objek. <strong>Imej</strong> menghadap arah yang sama seperti
			<strong>objek</strong> — inilah yang membezakan translasi daripada pantulan kelak.
		</p>

		<figure class="space-y-4">
			<FigureCard aspect="19/10">
				<Stage viewBox="0 0 190 100" class="h-full w-full">
					<!-- objek slides onto its imej; the slide-to-overlay derives the
					     vector from the two figures, so the motion can't drift. -->
					<SlideToOverlay object={objek} target={imej} play={moved} targetVariant="ghost" />
				</Stage>
			</FigureCard>

			<figcaption class="text-center opacity-70">
				Objek menggelongsor ke imejnya — setiap titik beralih anjakan yang sama, jadi bentuk, saiz,
				dan orientasi tetap sama.
			</figcaption>
		</figure>

		<div class="text-center">
			<button class="btn btn-primary" onclick={() => (moved = !moved)}>
				{moved ? 'Set semula' : 'Tunjuk translasi'}
			</button>
		</div>
	</section>

	<!-- Beat 2 — Vektor translasi: the Explorable. The student sets the Translation
	     vector with the (a, b) stepper; the Image (translate(object, vector)), the
	     arrow, and the (a over b) notation all derive from the same rune. clamp
	     keeps every translated vertex on the −6…+6 satah Cartes. -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Vektor translasi</h2>
		<p class="leading-relaxed">
			Translasi dibaca pada <strong>satah Cartes</strong> dan diperihalkan sepenuhnya oleh satu
			<strong>vektor translasi</strong>. Tetapkan anjakan <strong>(a, b)</strong> — <em>a</em> unit
			ke kanan (negatif ke kiri) dan <em>b</em> unit ke atas (negatif ke bawah) — dengan butang atau
			dengan menyeret hujung anak panah — dan lihat <strong>imej</strong> menggelongsor manakala
			<strong>objek</strong> kekal di tempatnya.
		</p>

		<figure class="space-y-4">
			<FigureCard aspect="1/1" class="max-w-md">
				<Stage range={6} class="h-full w-full">
					<!-- Imej drawn faint behind, the fixed objek solid, the vektor on top. -->
					<g class="opacity-30">
						<Figure shape={imejPx} />
					</g>
					<Figure shape={objekPx} />
					<VectorArrow from={arrowFrom} to={arrowTo} />
					<!-- The draggable arrowhead knob. Pointer handling lives here in the
					     Explorable; it snaps to whole grid points via grid.ts and writes
					     the same vektor rune as the steppers. -->
					<circle
						class="cursor-grab"
						class:cursor-grabbing={dragging}
						cx={arrowTo.x}
						cy={arrowTo.y}
						r="4"
						fill="currentColor"
						stroke="var(--color-base-100, white)"
						stroke-width="1.5"
						style="touch-action: none;"
						role="button"
						tabindex="0"
						aria-label="Seret hujung anak panah untuk menetapkan vektor translasi"
						onpointerdown={onHandleDown}
						onpointermove={onHandleMove}
						onpointerup={onHandleUp}
						onkeydown={onHandleKey}
					/>
				</Stage>
			</FigureCard>

			<figcaption class="text-center opacity-70">
				Objek (pekat) dan imejnya (lut) — setiap titik beralih mengikut vektor translasi yang sama.
			</figcaption>
		</figure>

		<div class="flex flex-wrap items-center justify-center gap-8">
			<VectorStepper value={vektor} onchange={setVektor} />
			<div class="flex flex-col items-center gap-2">
				<span class="text-sm font-semibold tracking-wide uppercase opacity-60"
					>Vektor translasi</span
				>
				<ColumnVector value={vektor} />
			</div>
		</div>
	</section>

	<!-- Beat 3 — Latihan: the reverse drill. Shown an objek and its imej on the
	     grid, the student enters the vektor translasi with the same stepper. The
	     correct answer is derived (vectorQuiz.correctAnswer), never authored, and
	     the slide-to-overlay confirms it along the genuine translation. -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Latihan: Cari vektor translasi</h2>
		<p class="leading-relaxed">
			Setiap pasangan menunjukkan sebuah <strong>objek</strong> dan <strong>imej</strong>nya.
			Tentukan <strong>vektor translasi</strong> <strong>(a, b)</strong> yang memetakan objek kepada imej,
			kemudian sahkan jawapan anda.
		</p>

		<!-- objek (filled) slides onto the imej outline when the "why" plays; the
		     slide derives its vector from the two px figures. The stepper is the
		     same control as the Explorable, so entry and exploration look alike. -->
		<LatihanShell
			index={quiz.index}
			total={vqPairs.length}
			answered={vqAnswered}
			correct={vqCorrect}
			last={vqLast}
			overlayPlaying={quiz.overlayPlaying}
			object={vqObjekPx}
			target={vqImejPx}
			aspect="1/1"
			cardClass="max-w-md"
			range={6}
			onnext={advancePair}
		>
			{#snippet input(committed)}
				{#if !committed}
					<div class="flex flex-wrap items-center justify-center gap-8">
						<VectorStepper value={guess} onchange={(next) => (guess = next)} />
						<div class="flex flex-col items-center gap-2">
							<span class="text-sm font-semibold tracking-wide uppercase opacity-60">
								Jawapan anda
							</span>
							<ColumnVector value={guess} />
						</div>
					</div>
					<div class="text-center">
						<button class="btn btn-primary" onclick={submitGuess}>Sahkan jawapan</button>
					</div>
				{/if}
			{/snippet}

			{#snippet feedback()}
				{#if vqCorrect}
					Vektor translasinya ialah ({vqAnswer.dx}, {vqAnswer.dy}) — perhatikan objek bertindih
					tepat dengan imej.
				{:else}
					Anda menjawab ({guess.dx}, {guess.dy}); vektor translasi yang betul ialah ({vqAnswer.dx},
					{vqAnswer.dy}).
				{/if}
			{/snippet}
		</LatihanShell>
	</section>
</LessonShell>
