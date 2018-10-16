module powerbi.extensibility.visual {
    "use strict";
    export class Visual implements IVisual {
        private svg: d3.Selection<d3.BaseType, {}, null, undefined>;
        private settings: VisualSettings;
        private gcontainer: d3.Selection<d3.BaseType, {}, null, undefined>;
        private back_rectangle: d3.Selection<d3.BaseType, number, d3.BaseType, {}>;

        constructor(options: VisualConstructorOptions) {
            this.svg = d3.select(options.element).append('svg');
            this.gcontainer = this.svg.append('g').classed('percenter', true);

            var arc = d3.arc()
                .outerRadius(50)
                .innerRadius(40);

            var color = d3.scaleOrdinal()
                .range(["#98abc5", "#8a89a6", "#7b6888"]);

            var pie = d3.pie()
                .sort(null)
                .value(d => <any>d);

            var g = this.svg.selectAll(".arc")
                .data(pie([30,70,260]))
                .enter().append("g")
                .attr('transform', `translate(${100 / 2}, ${100 / 2})`)
                .attr("class", "arc");

            g.append("path")
                .attr("d", <any>arc)
                .style("fill", d => <any>color(<any>d.data));
        }

        public update(options: VisualUpdateOptions) {
            this.svg.attr("width", options.viewport.width);
            this.svg.attr("height", options.viewport.height);
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }
    }
}