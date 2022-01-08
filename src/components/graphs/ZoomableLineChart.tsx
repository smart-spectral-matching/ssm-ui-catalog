import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Button, CardActions, Checkbox, FormControlLabel, styled, useTheme } from '@mui/material';
import type { ZoomTransform } from 'd3';
import { axisBottom, axisLeft, curveCatmullRom, line, max, min, scaleLinear, select, zoom } from 'd3';

import { DataSeries } from 'types';
import useResizeObserver from 'utils/useResizeObserver';

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
  },
}));

// used for SVG definitions if not defined by the parent component.
const RANDOM_ID = `${Math.random()}`;

/**
 * Component that renders a ZoomableLineChart
 */

const ZoomableLineChart: FC<PropsWithChildren<{ dataseries: DataSeries; id?: string }>> = ({ children, dataseries, id = RANDOM_ID }) => {
  const theme = useTheme();

  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const dimensions = useResizeObserver(wrapperRef);

  const state = useLocalObservable(() => ({
    reverseData: false,
    currentXZoomState: undefined as ZoomTransform | undefined,
    get xLabel() {
      return dataseries['x-axis'].label;
    },
    get xLabelShort() {
      return dataseries['x-axis'].parameter.property;
    },
    get yLabel() {
      return dataseries['y-axis'].label;
    },
    get yLabelShort() {
      return dataseries['y-axis'].parameter.property;
    },
    get data() {
      const xData = dataseries['x-axis'].parameter.numericValueArray.numberArray;
      const yData = dataseries['y-axis'].parameter.numericValueArray.numberArray;
      if (xData.length !== yData.length) window.console.warn('WARNING: Data does not have 1:1 ratio of X and Y values!');
      return xData.length >= yData.length ? yData.map((value, idx) => [xData[idx], value]) : xData.map((value, idx) => [value, yData[idx]]);
    },
  }));

  // will be called initially and on every data change
  useEffect(() => {
    // allow resizeObserver to run through once before executing the entire D3 code
    if (!dimensions) return;

    const width = dimensions.width;
    const height = dimensions.height;
    const svg = select(svgRef.current!).attr('height', height).attr('width', width);
    const svgContent = svg.select('.content');

    // tooltip
    const tooltip = select(tooltipRef.current!).style('opacity', 0);

    // x-scale
    const xMax = max(state.data, (d) => d[0])!;
    const xMin = Math.min(0, min(state.data, (d) => d[0]) ?? 0);
    const xScale = scaleLinear()
      .domain([xMin, xMax])
      .range(state.reverseData ? [width - 10, 10] : [10, width - 10])
      .nice();

    // x-scale zoom management
    if (state.currentXZoomState) {
      const newXScale = state.currentXZoomState.rescaleX(xScale);
      xScale.domain(newXScale.domain());
    }

    // y-scale
    const yMax = max(state.data, (d) => d[1])!;
    const yMin = Math.max(0, min(state.data, (d) => d[1]) ?? 0);
    const yScale = scaleLinear()
      .domain([yMin, yMax])
      .range([height - 10, 15])
      .nice();

    // line generator
    const lineGenerator = line()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]))
      .curve(curveCatmullRom);

    // line graph
    svgContent
      .selectAll('.myLine')
      .data([state.data])
      .join('path')
      .attr('class', 'myLine')
      .attr('stroke', 'black')
      .attr('fill', 'none')
      // @ts-ignore
      .attr('d', lineGenerator);

    // points
    svgContent
      .selectAll('.myDot')
      .data(state.data)
      .join('circle')
      .attr('class', 'myDot')
      .attr('stroke', 'black')
      .attr('r', 2)
      .attr('fill', 'orange')
      // @ts-ignore
      .attr('cx', (val) => xScale(val[0]))
      // @ts-ignore
      .attr('cy', (val) => yScale(val[1]))
      .on('mouseover', (event, d) => {
        tooltip.style('opacity', 0.9);
        tooltip
          .html(`${state.xLabelShort}: ${d[0]}<br>${state.yLabelShort}: ${d[1]}`)
          .style('left', `${event.pageX - 80}px`)
          .style('top', `${event.pageY - 64}px`);
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });

    // x-axis
    const xAxis = axisBottom(xScale);
    svg
      .select('.x-axis')
      .attr('transform', `translate(0, ${height})`)
      // @ts-ignore
      .call(xAxis);

    // x-axis label
    svg
      .select('.x-axis-text')
      .attr('transform', `translate(${width / 2},${height + margin.bottom - 5})`)
      .style('text-anchor', 'middle')
      .text(state.xLabel);

    // y-axis
    const yAxis = axisLeft(yScale);
    // @ts-ignore
    svg.select('.y-axis').call(yAxis);

    // y-axis label
    svg
      .select('.y-axis-text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(state.yLabel);

    // zoom
    const zoomBehavior = zoom()
      .scaleExtent([1, 50])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on('zoom', (event) => {
        const zoomState = event.transform;
        state.currentXZoomState = zoomState;
      });

    // @ts-ignore
    svg.call(zoomBehavior);
  }, [
    state.currentXZoomState,
    state.data,
    state.xLabel,
    state.xLabelShort,
    state.yLabel,
    state.yLabelShort,
    state.reverseData,
    dimensions,
  ]);

  return (
    <>
      <Wrapper>
        <div ref={wrapperRef}>
          <svg ref={svgRef}>
            <defs>
              <clipPath id={id}>
                <rect x="0" y="0" width="100%" height="100%" />
              </clipPath>
            </defs>
            <g className="content" clipPath={`url(#${id})`} />
            <g className="x-axis" />
            <g className="y-axis" />
            <text className="x-axis-text" fill={theme.palette.text.primary} />
            <text className="y-axis-text" fill={theme.palette.text.primary} />
          </svg>
          <div ref={tooltipRef} className="d3-tip" />
        </div>
      </Wrapper>
      <CardActions sx={{ justifyContent: 'space-around', borderTop: `3px solid ${theme.palette.divider}` }}>
        {children}
        <FormControlLabel
          control={<Checkbox checked={state.reverseData} onChange={(e) => (state.reverseData = e.target.checked)} />}
          label="Reverse X axis"
        />
        <Button variant="outlined" color="primary" onClick={() => (state.currentXZoomState = undefined)}>
          Reset Zoom State
        </Button>
      </CardActions>
    </>
  );
};
export default observer(ZoomableLineChart);
