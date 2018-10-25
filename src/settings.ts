module powerbi.extensibility.visual {
  "use strict";
  import DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;

  export class VisualSettings extends DataViewObjectsParser {
    public legend: legendSettings = new legendSettings();
    public vor: VorSettings = new VorSettings();
    public shape: shapeSettings = new shapeSettings();
  }

  export class legendSettings {
    public show: boolean = true;
    public color: string = "#777777";
    public fontsize: number = 16;
    public retourligne: boolean = false;
    public bold: boolean = false;
    public fontFamily: string = "\"Segoe UI\", wf_segoe-ui_normal, helvetica, arial, sans-serif";
  }

  export class shapeSettings {
    public text_color: string = "#000";
    public text_size: number = 16;
    public arc_linesize: number = 20;
    public percent: boolean = true;
  }

  export class VorSettings {
    public show: boolean = true;
    public lowColor: string = "#f44336";
    public middleColor: string = "#ff9800";
    public highColor: string = "#4caf50";
  }
}
