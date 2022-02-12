<script>
  import { drawFill, drawStroke, textUpper } from './PrivacyCake.svelte';
  import Color from 'color';
  import { checked } from './Slider.svelte';

  export let maxRadius;
  export let minRadius;
  export let startAngle;
  export let endAngle;
  export let members;
  export let color;
  export let strokeWidth;
  export let toggled;

  export let id;

  const center = { x: 0, y: 0 };

  let strokeColor = Color(color);
  let fillColor = Color(color).alpha(0.4);
  let textColor = Color(color).darken(0.2);
  let radius =
    Math.max(Math.max(...members.filter((m) => m.checked).map((m) => m.riskScore)), 0.001) *
      (maxRadius - minRadius) +
    minRadius;

  $: fill = drawFill(center.x, center.y, radius, startAngle, endAngle);
  $: stroke = drawStroke(center.x, center.y, radius, startAngle, endAngle);

  const onResize = (event) => {
    let boudings = event.srcElement.ownerSVGElement.getBoundingClientRect();
    let clientOffsetX = boudings.left + boudings.width / 2;
    let clientOffsetY = boudings.top + boudings.height / 2;

    let touch = event.touches[0];
    if (!toggled) {
      let position = {
        x: touch.clientX - clientOffsetX,
        y: touch.clientY - clientOffsetY
      };
      radius = Math.max(
        minRadius,
        Math.min(maxRadius, Math.sqrt(position.x ** 2 + position.y ** 2))
      );
      threshold = (radius - minRadius) / (maxRadius - minRadius);
      members.forEach((m) => {
        m.checked = m.riskScore <= threshold;
      });
    }
  };
</script>

<g {id}>
  <path
    id="{id}-background"
    d={drawFill(center.x, center.y, maxRadius + strokeWidth / 2, startAngle, endAngle)}
    fill="#AAA4"
    on:touchmove|preventDefault
  />

  <path id="{id}-fill" d={fill} fill={fillColor} on:touchmove|preventDefault={onResize} />
  <path
    id="{id}-stroke"
    d={stroke}
    fill="none"
    stroke={strokeColor}
    stroke-width={strokeWidth}
    on:touchmove|preventDefault={onResize}
  />
  <text
    on:touchmove|preventDefault={onResize}
    fill={textColor}
    font-size="1.2em"
    dy={textUpper(startAngle, endAngle) ? '-10px' : '25px'}
    font-weight="bold"
    font-family="Arial, Helvetica, sans-serif"
  >
    <textPath href="#{id}-stroke" startOffset="50%" text-anchor="middle">
      {members.filter((x) => checked((radius - minRadius) / (maxRadius - minRadius), x.riskScore))
        .length}/{members.length}
    </textPath>
  </text>
</g>
