declare module 'react-vertical-timeline-component' {
  import { ReactNode, CSSProperties } from 'react';

  export interface VerticalTimelineProps {
    animate?: boolean;
    className?: string;
    layout?: '1-column' | '1-column-left' | '1-column-right' | '2-columns';
    lineColor?: string;
    children?: ReactNode;
  }

  export interface VerticalTimelineElementProps {
    className?: string;
    contentArrowStyle?: CSSProperties;
    contentStyle?: CSSProperties;
    date?: string;
    dateClassName?: string;
    icon?: ReactNode;
    iconClassName?: string;
    iconOnClick?: () => void;
    iconStyle?: CSSProperties;
    position?: string;
    style?: CSSProperties;
    textClassName?: string;
    visible?: boolean;
    children?: ReactNode;
  }

  export const VerticalTimeline: React.FC<VerticalTimelineProps>;
  export const VerticalTimelineElement: React.FC<VerticalTimelineElementProps>;
}
