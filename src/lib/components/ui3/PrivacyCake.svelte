<script context="module">
  export const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    let angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  export const cartesianToPolar = (centerX, centerY, x, y) => {
    // Normalization (correct the center offset)
    x = x - centerX;
    y = y - centerY;

    let distance = Math.sqrt(x * x + y * y);
    let radians = Math.atan2(y, x);
    return {
      distance: distance,
      radians: radians
    };
  };

  export const drawStroke = (centerX, centerY, radius, startAngle, endAngle) => {
    let start = polarToCartesian(centerX, centerY, radius, endAngle);
    let end = polarToCartesian(centerX, centerY, radius, startAngle);

    let d;
    if (textUpper(startAngle, endAngle)) {
      d = [`M ${end.x} ${end.y}`, `A ${radius} ${radius} 1 0 1 ${start.x} ${start.y}`].join(' ');
    } else {
      d = [`M ${start.x} ${start.y}`, `A ${radius} ${radius} 0 0 0 ${end.x} ${end.y}`].join(' ');
    }
    return d;
  };

  export const textUpper = (startAngle, endAngle) => {
    let textAngle = startAngle + (endAngle - startAngle) / 2;
    textAngle = ((textAngle % 360) + 360) % 360;

    return textAngle >= 270 || (textAngle >= 0 && textAngle < 90);
  };

  export const drawFill = (x, y, radius, startAngle, endAngle) => {
    let start = polarToCartesian(x, y, radius, endAngle);
    let end = polarToCartesian(x, y, radius, startAngle);

    let largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    let d = [
      `M ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      `L 0 0`,
      `L ${start.x} ${start.y}`
    ].join(' ');

    return d;
  };

  export const drawSeparator = (x, y, radius, startAngle) => {
    let start = polarToCartesian(x, y, radius, startAngle);
    let d = [`M 0 0`, `L ${start.x} ${start.y}`].join(' ');

    return d;
  };
</script>

<script lang="ts">
  import CakePart from './CakePart.svelte';
  import CakePartSeparator from './CakePartSeparator.svelte';
  import type { Action } from '$lib/stores/taskTracking';
  import { createEventDispatcher } from 'svelte';
  import type { Dictionary } from 'lodash';
  import type { Member } from '$lib/members';

  const dispatcher = createEventDispatcher();

  export let width = 360;
  export let height = 360;
  export let maxRadius = Math.min(width, height) / 2 - 30;
  export let minRadius = 40;
  export let strokeWidth = 10;
  export let groups: Dictionary<Member[]>;
  export let groupsMetaData: Dictionary<{
    title: string;
    color: string;
    startAngle: number;
    endAngle: number;
  }>;
  export let thresholds: Dictionary<number>;
  export let toggled = false;
  export let selected = null;
  let svg;

  const track = (action: Action, data?: any) => {
    dispatcher('track', { action: action, data: data });
  };
</script>

<svg bind:this={svg} {width} {height} xmlns="http://www.w3.org/2000/svg">
  <g
    transform="translate({width / 2}, {height / 2})"
    on:pointerup|preventDefault={(event) => {
      if (toggled) {
        let boudings = svg.getBoundingClientRect();
        let clientOffsetX = boudings.left + boudings.width / 2;
        let clientOffsetY = boudings.top + boudings.height / 2;

        let x = event.clientX;
        let y = event.clientY;
        let { distance } = cartesianToPolar(clientOffsetX, clientOffsetY, x, y);

        if (distance < minRadius) {
          selected = null;
        } else if (distance < maxRadius) {
          let parsedSelected = document.elementFromPoint(x, y).id.split('-')[1];
          if (parsedSelected) {
            selected = parsedSelected;
            track('open-group', { group: selected });
          } else {
            track('touchevent', { memo: 'out-of-circle' });
            selected = null;
          }
        }
      }
      track('touchevent', { memo: 'pointer-up' });
      toggled = false;
    }}
  >
    <g>
      {#each Object.entries(groupsMetaData) as [_, { title, color, startAngle, endAngle }], id}
        <CakePart
          bind:threshold={thresholds[title]}
          id="{id}-{title}"
          {startAngle}
          {endAngle}
          {color}
          bind:members={groups[title]}
          {strokeWidth}
          {maxRadius}
          {minRadius}
          {toggled}
          on:track={({ detail: { action, data } }) => {
            track(action, data);
          }}
        />
      {/each}
    </g>
    <g>
      {#each Object.entries(groupsMetaData) as [_, { startAngle }]}
        <CakePartSeparator
          {startAngle}
          strokeColor="white"
          strokeWidth={2}
          radius={maxRadius + strokeWidth / 2}
        />
      {/each}
    </g>
    <g>
      <g
        on:touchmove|preventDefault
        on:pointerdown|preventDefault={() => {
          toggled = true;
          track('touchevent', { memo: 'pointer-down' });
        }}
        id="select"
      >
        <circle r="30" fill="#888" stroke="#666" stroke-width="5" />
        <g transform="translate(-18.5, -18.5) scale(1.5)">
          <path
            fill="#DDD"
            d="M 12,4 
           A 4,4 0 0,1 16,8
           A 4,4 0 0,1 12,12
           A 4,4 0 0,1 8,8
           A 4,4 0 0,1 12,4
           M 12,14 C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
          />
        </g>
      </g>
    </g>
  </g>
</svg>
