import {
  BergInputComponent,
  BergListComponent,
  BergRadioComponent,
  BergSelectComponent,
  BergSlideToggleComponent,
  BergTableComponent,
} from '@berglund/material';
export const Enum = {
  BergInputComponent: {
    component: BergInputComponent,
    inputs: {
      type: 'text',
      ariaLabel: 'Enum',
      label: 'Enum',
    },
  },
  BergListComponent: {
    component: BergListComponent,
    inputs: {
      data: ['A', 'B', 'C'],
    },
  },
  BergRadioComponent: {
    component: BergRadioComponent,
    inputs: {
      data: ['A', 'B', 'C'],
    },
  },
  BergSelectComponent: {
    component: BergSelectComponent,
    inputs: {
      data: ['A', 'B', 'C'],
    },
  },
  BergSlideToggleComponent: {
    component: BergSlideToggleComponent,
    inputs: {},
  },
};
export const Test = {
  BergTableComponent: {
    component: BergTableComponent,
    inputs: {
      columns: [
        {
          key: 'enum',
          label: 'Enum',
        },
        {
          key: 'string',
          label: 'String',
        },
        {
          key: 'number',
          label: 'Number',
        },
        {
          key: 'null',
          label: 'Null',
        },
        {
          key: 'numberArray',
          label: 'Number array',
        },
        {
          key: 'enumArray',
          label: 'Enum array',
        },
      ],
    },
  },
};
