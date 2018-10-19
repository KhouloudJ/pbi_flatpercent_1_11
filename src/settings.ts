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
    public color: string = "#616161";
    public fontsize: number = 28;
    public retourligne: boolean = false;
  }

  export class shapeSettings {
    public text_color: string = "#000";
    public text_size: number = 16;
    public arc_linesize: number = 20;
  }

  export class VorSettings {
    public show: boolean = false;
    public lowColor: string = "#f44336";
    public middleColor: string = "#ff9800";
    public highColor: string = "#4caf50";
  }
}
