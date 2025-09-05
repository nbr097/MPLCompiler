<script lang="ts">
  import { onMount } from 'svelte';
  import JsBarcode from 'jsbarcode';

  export let value: string = '';        // the article number
  export let format: string = 'CODE128';// robust for any length digits
  export let height: number = 42;       // tweak for readability/printing
  export let width: number = 1.6;       // bar thickness (px per module)
  export let displayValue: boolean = true;
  export let fontSize: number = 11;

  let svgEl: SVGSVGElement;

  function render() {
    if (!value) return;
    try {
      JsBarcode(svgEl, value, {
        format,
        height,
        width,
        displayValue,
        fontSize,
        margin: 4,
        textMargin: 2,
        background: 'transparent'
      });
    } catch (e) {
      console.error('Barcode render error:', e);
    }
  }

  onMount(render);
  $: value, render(); // re-render if value changes
</script>

<svg bind:this={svgEl} class="max-w-[220px] h-auto"></svg>
