// Minimal type declarations for ECharts to satisfy TypeScript in this project.
// This avoids "Cannot find module 'echarts'" errors while allowing basic typing.

declare module 'echarts' {
  export interface ECharts {
    setOption(option: any): void;
    resize(): void;
    dispose(): void;
  }

  export function init(dom: HTMLElement): ECharts;

  export namespace graphic {
    class LinearGradient {
      constructor(
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        colorStops: { offset: number; color: string }[],
        globalCoord?: boolean
      );
    }
  }
}



