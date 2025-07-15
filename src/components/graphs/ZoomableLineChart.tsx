import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Button, CardActions, Checkbox, FormControlLabel, styled, useTheme } from '@mui/material';
import type { ZoomTransform } from 'd3';
import { axisBottom, axisLeft, curveCatmullRom, line, scaleLinear, schemeCategory10, select, zoom, zoomIdentity } from 'd3';

import { Axis, DataSeries, ValueArray } from 'types';
import { sanitizeHTML } from 'utils';
import useResizeObserver from 'utils/useResizeObserver';

const colors = schemeCategory10;

const margin = { top: 10, right: 10, bottom: 50, left: 75 }; // TODO maybe provide this from a parent component instead
const Wrapper = styled('div')(({ theme }) => ({
  marginTop: `${margin.top}px`,
  marginRight: `${margin.right}px`,
  marginBottom: `${margin.bottom}px`,
  marginLeft: `${margin.left}px`,
  '& svg': {
    background: theme.palette.grey[300],
    overflow: 'visible',
    display: 'block',
    height: '600px', // TODO maybe provide this from a parent component instead
    maxHeight: `calc(100vh - ${margin.top + margin.bottom}px)`,
    width: '100%',
    '& .axis-label': {
      textAnchor: 'middle',
    },
  },
}));

const D3Tooltip = styled('div')(({ theme }) => ({
  position: 'absolute',
  lineHeight: 1,
  fontWeight: 'bold',
  padding: '12px',
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  border: 0,
  borderRadius: '8px',
  pointerEvents: 'none',
  opacity: 0,
}));

// used for SVG definitions if not defined by the parent component.
const RANDOM_ID = `${Math.random()}`;

const TRANSLATION_X_RATE = 10;

function dataMapper(xValueArr: ValueArray, yValueArr: ValueArray) {
  const xData = xValueArr.numberArray;
  const yData = yValueArr.numberArray;
  if (xData.length !== yData.length) window.console.warn('WARNING: Data does not have 1:1 ratio of X and Y values!');
  return xData.length >= yData.length ? yData.map((value, idx) => [xData[idx], value]) : xData.map((value, idx) => [value, yData[idx]]);
}

function getUnitRef(axis: Axis, valueArrIdx: number) {
  const ref = axis.parameter.numericValueArray[valueArrIdx].unitRef;
  if (ref) return ` (${ref})`;
  return '';
}

/**
 * Reduce an array of numbers to [minimum, maximum] format. Callback function of Array.prototype.reduce
 *
 * @param acc last state of [min, max]
 * @param curr value in the number[] array to iterate over
 * @returns [min, max]
 */
function minMaxReducer(acc: [number, number], curr: number): [number, number] {
  return [Math.min(acc[0], curr), Math.max(acc[1], curr)];
}

/**
 * Component that renders a ZoomableLineChart
 */

const ZoomableLineChart: FC<PropsWithChildren<{ dataseries: DataSeries; id?: string }>> = ({ children, dataseries, id = RANDOM_ID }) => {
  const theme = useTheme();

  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);

  const dimensions = useResizeObserver(wrapperRef);
  const state = useLocalObservable(() => ({
    reverseData: false,
    zoomTransform: undefined as ZoomTransform | undefined,
    /*
     * D3 gets really picky if you try to modify its ZoomBehavior with React (or with entirely new D3 selections), so just manage all zoom behavior in this function
     */
    refreshZoomBehavior: (width: number, height: number) => {
      // zoom
      const zoomBehavior = zoom()
        .scaleExtent([1, 128]) // 1 = default zoom, > 1 = zoom in, < 1 = zoom out
        .translateExtent([
          [0, 0],
          [width, height],
        ])
        .on('zoom', (event) => {
          state.zoomTransform = event.transform;
        });
      // @ts-ignore
      const svg = select(svgRef.current!).call(zoomBehavior);
      const buttonEle = select(resetButtonRef.current!);
      // @ts-ignore
      buttonEle.on('click', () => svg.transition().call(zoomBehavior.transform, zoomIdentity));
      // eslint-disable-next-line complexity
      svg.on('keydown', (e: KeyboardEvent) => {
        // do not override any browser defaults
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        switch (e.key.toLowerCase()) {
          // zoom in
          case 'w':
          case '=':
          case '+':
          case 'arrowup':
            e.preventDefault();
            // @ts-ignore
            svg.call(zoomBehavior.scaleBy, 2);
            break;
          // zoom out
          case 's':
          case '-':
          case '_':
          case 'arrowdown':
            e.preventDefault();
            // @ts-ignore
            svg.call(zoomBehavior.scaleBy, 0.5);
            break;
          // pan left
          case 'a':
          case 'arrowleft':
            e.preventDefault();
            // @ts-ignore
            svg.call(zoomBehavior.translateBy, TRANSLATION_X_RATE / (state.zoomTransform?.k || 1), 0);
            break;
          // pan right
          case 'd':
          case 'arrowright':
            e.preventDefault();
            // @ts-ignore
            svg.call(zoomBehavior.translateBy, -TRANSLATION_X_RATE / (state.zoomTransform?.k || 1), 0);
            break;
          default:
            break;
        }
      });
    },
    get xLabelShort() {
      return dataseries['x-axis'].parameter.property;
    },
    get yLabelShort() {
      return dataseries['y-axis'].parameter.property;
    },
    get data() {
      const allX = dataseries['x-axis'].parameter.numericValueArray;
      const allY = dataseries['y-axis'].parameter.numericValueArray;
      if (allX.length !== allY.length) window.console.warn('numericValueArray of x and y axis are not equal');
      return allX.length >= allY.length ? allY.map((v, i) => dataMapper(allX[i], v)) : allX.map((v, i) => dataMapper(v, allY[i]));
    },
    // for both x and y:
    // include 0 in all graphs, either as minimum or as maximum
    get boundaries() {
      const alldata = state.data.flat();
      const xMinMax = alldata.map((d) => d[0]).reduce(minMaxReducer, [0, 0]);
      const yMinMax = alldata.map((d) => d[1]).reduce(minMaxReducer, [0, 0]);
      return {
        xMax: xMinMax[1],
        xMin: xMinMax[0],
        yMax: yMinMax[1],
        yMin: yMinMax[0],
      };
    },
  }));

  // will be called initially and on every data change
  // TODO - we should really use React instead of D3 to manage the DOM, see https://wattenberger.com/blog/react-and-d3 as a starting point
  // also consider using the Victory library (https://formidable.com/open-source/victory/)
  useEffect(() => {
    // allow resizeObserver to run through once before executing the entire D3 code
    if (!dimensions) return;

    const width = dimensions.width;
    const height = dimensions.height;
    const svg = select(svgRef.current!).attr('height', height).attr('width', width);
    const svgContent = svg.selectChild('.content');

    // tooltip
    const tooltip = select(tooltipRef.current!).style('opacity', 0);

    // x-scale
    const xScale = scaleLinear()
      .domain([state.boundaries.xMin, state.boundaries.xMax])
      .range(state.reverseData ? [width - 10, 10] : [10, width - 10])
      .nice();

    // x-scale zoom management
    if (state.zoomTransform && state.zoomTransform.k !== 1) {
      const newXScale = state.zoomTransform.rescaleX(xScale);
      xScale.domain(newXScale.domain());
    }

    // y-scale
    const yScale = scaleLinear()
      .domain([state.boundaries.yMin, state.boundaries.yMax])
      .range([height - 10, 15])
      .nice();

    // line generator
    const lineGenerator = line()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]))
      .curve(curveCatmullRom);

    state.data.forEach((data, idx) => {
      // TODO optimize selection here, while also not creating hiccups when zooming or panning
      const color = colors[idx % colors.length];

      // line graph
      svgContent
        .selectChildren(`.d3Line-${idx}`)
        .data([data])
        .join('path')
        .attr('class', `d3Line-${idx}`)
        .attr('stroke', color)
        .attr('fill', 'none')
        // @ts-ignore
        .attr('d', lineGenerator);

      // points
      svgContent
        .selectChildren(`.d3Dot-${idx}`)
        .data(data)
        .join('circle')
        .attr('class', `d3Dot-${idx}`)
        .attr('stroke', 'none')
        .attr('r', 2)
        .attr('fill', color)
        .attr('cx', (val) => xScale(val[0]))
        .attr('cy', (val) => yScale(val[1]))
        .on('mouseover', (event, d) => {
          const xInfo = sanitizeHTML(`${state.xLabelShort}${getUnitRef(dataseries['x-axis'], idx)}: ${d[0]}`);
          const yInfo = sanitizeHTML(`${state.yLabelShort}${getUnitRef(dataseries['y-axis'], idx)}: ${d[1]}`);
          tooltip
            .style('opacity', 0.9)
            .html(`${xInfo}<br>${yInfo}`)
            .style('left', `${event.pageX - 80}px`)
            .style('top', `${event.pageY - 64}px`);
        })
        .on('mouseout', () => {
          tooltip.style('opacity', 0);
        });
    });

    // x-axis
    const xAxis = axisBottom(xScale).ticks(Math.floor(width / 45));
    svg
      .selectChild('.x-axis')
      // @ts-ignore
      .call(xAxis);

    // y-axis
    const yAxis = axisLeft(yScale).ticks(Math.floor(height / 30));
    // @ts-ignore
    svg.selectChild('.y-axis').call(yAxis);
  }, [state.zoomTransform, state.data, state.boundaries, state.xLabelShort, state.yLabelShort, state.reverseData, dimensions]);

  // refresh zoom behavior if the dimensions have changed
  useEffect(() => {
    // allow resizeObserver to run through once before executing the entire D3 code
    if (!dimensions) return;

    const width = dimensions.width;
    const height = dimensions.height;
    state.refreshZoomBehavior(width, height);
  }, [dimensions]);

  return (
    <>
      <Wrapper ref={wrapperRef}>
        <svg ref={svgRef} tabIndex={0} aria-label="Visualization Chart">
          <defs>
            <clipPath id={id}>
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
          <g className="content" clipPath={`url(#${id})`} />
          <g className="x-axis" transform={`translate(0, ${dimensions?.height ?? 0})`} />
          <g className="y-axis" />
          <text
            fill={theme.palette.text.primary}
            transform={`translate(${(dimensions?.width ?? 0) / 2},${(dimensions?.height ?? 0) + margin.bottom - 5})`}
            className="axis-label"
          >
            {dataseries['x-axis'].label}
          </text>
          <text
            fill={theme.palette.text.primary}
            transform="rotate(-90)"
            y={-margin.left}
            x={0 - (dimensions?.height ?? 0) / 2}
            dy="1em"
            className="axis-label"
          >
            {dataseries['y-axis'].label}
          </text>
        </svg>
        <D3Tooltip ref={tooltipRef} />
      </Wrapper>
      <CardActions sx={{ justifyContent: 'space-around', borderTop: `3px solid ${theme.palette.divider}` }}>
        {children}
        <FormControlLabel
          control={<Checkbox checked={state.reverseData} onChange={(e) => (state.reverseData = e.target.checked)} />}
          label="Reverse X axis"
        />
        <Button variant="outlined" color="primary" ref={resetButtonRef}>
          Reset Zoom State
        </Button>
      </CardActions>
    </>
  );
};
export default observer(ZoomableLineChart);
