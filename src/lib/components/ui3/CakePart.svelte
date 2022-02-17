<script lang="ts" context="module">
  export const getRadius = (minRadius: number, maxRadius: number, threshold: number): number => {
    return threshold * (maxRadius - minRadius) + minRadius;
  };
</script>

<script lang="ts">
  import { drawFill, drawStroke, textUpper } from './PrivacyCake.svelte';
  import Color from 'color';
  import { checker } from './Slider.svelte';
  import type { Action } from '$lib/stores/taskTracking';
  import { createEventDispatcher } from 'svelte';
  import type { Member } from '$lib/members';

  const dispatcher = createEventDispatcher();

  export let maxRadius: number;
  export let minRadius: number;
  export let startAngle: number;
  export let endAngle: number;
  export let members: Member[];
  export let color: any;
  export let strokeWidth: number;
  export let toggled: boolean;
  export let threshold: number;

  export let id: any;

  const center = { x: 0, y: 0 };

  let strokeColor = Color(color);
  let fillColor = Color(color).alpha(0.4);
  let textColor = Color(color).darken(0.2);
  $: radius = getRadius(minRadius, maxRadius, threshold);

  $: fill = drawFill(center.x, center.y, radius, startAngle, endAngle);
  $: stroke = drawStroke(center.x, center.y, radius, startAngle, endAngle);

  const onResize = (event: TouchEvent) => {
    let svgElement = event.target as SVGElement;
    let boundings = svgElement.ownerSVGElement.getBoundingClientRect();
    let clientOffsetX = boundings.left + boundings.width / 2;
    let clientOffsetY = boundings.top + boundings.height / 2;

    let touch = event.touches[0];
    if (!toggled) {
      let position = {
        x: touch.clientX - clientOffsetX,
        y: touch.clientY - clientOffsetY
      };
      let newRadius = Math.max(
        minRadius,
        Math.min(maxRadius, Math.sqrt(position.x ** 2 + position.y ** 2))
      );
      threshold = (newRadius - minRadius) / (maxRadius - minRadius);
      members.forEach((m) => {
        m.checked = checker(threshold, m.riskScore);
      });
      members = [...members];
      track('change-threshold-group', { groupId: id, threshold: threshold, position: position });
    }
  };

  const track = (action: Action, data?: any) => {
    dispatcher('track', { action: action, data: data });
  };
</script>

<g {id}>
  <path
    id="{id}-background"
    d={drawFill(center.x, center.y, maxRadius + strokeWidth / 2, startAngle, endAngle)}
    fill="#AAA4"
    on:touchmove|preventDefault
  />

  <path
    id="{id}-fill"
    d={fill}
    fill={fillColor.toString()}
    on:touchmove|preventDefault={onResize}
  />
  <path
    id="{id}-stroke"
    d={stroke}
    fill="none"
    stroke={strokeColor.toString()}
    stroke-width={strokeWidth}
    on:touchmove|preventDefault={onResize}
  />
  <text
    on:touchmove|preventDefault={onResize}
    fill={textColor.toString()}
    font-size="1.2em"
    dy={textUpper(startAngle, endAngle) ? '-10px' : '25px'}
    font-weight="bold"
    font-family="Arial, Helvetica, sans-serif"
  >
    <textPath href="#{id}-stroke" startOffset="50%" text-anchor="middle">
      {members.filter((x) => checker((radius - minRadius) / (maxRadius - minRadius), x.riskScore))
        .length}/{members.length}
    </textPath>
  </text>
</g>
