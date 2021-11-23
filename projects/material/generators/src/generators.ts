import {
  BergCalendarComponent,
  BergCheckboxComponent,
  BergDatepickerComponent,
  BergInputComponent,
  BergListComponent,
  BergRadioComponent,
  BergSelectComponent,
  BergSlideToggleComponent,
  BergTableComponent,
} from '@berglund/material';
import {
  createJsonSchemaToCalendarGenerator,
  createJsonSchemaToCheckboxGenerator,
  createJsonSchemaToDatepickerGenerator,
  createJsonSchemaToInputGenerator,
  createJsonSchemaToListGenerator,
  createJsonSchemaToRadioGenerator,
  createJsonSchemaToSelectGenerator,
  createJsonSchemaToSlideToggleGenerator,
  createJsonSchemaToTableGenerator,
} from '@berglund/mixins/generators';

export const calendarGenerator = createJsonSchemaToCalendarGenerator(
  BergCalendarComponent,
  '@berglund/material'
);

export const checkboxGenerator = createJsonSchemaToCheckboxGenerator(
  BergCheckboxComponent,
  '@berglund/material'
);

export const datepickerGenerator = createJsonSchemaToDatepickerGenerator(
  BergDatepickerComponent,
  '@berglund/material'
);

export const inputGenerator = createJsonSchemaToInputGenerator(
  BergInputComponent,
  '@berglund/material'
);

export const listGenerator = createJsonSchemaToListGenerator(
  BergListComponent,
  '@berglund/material'
);

export const radioGenerator = createJsonSchemaToRadioGenerator(
  BergRadioComponent,
  '@berglund/material'
);

export const selectGenerator = createJsonSchemaToSelectGenerator(
  BergSelectComponent,
  '@berglund/material'
);

export const slideToggleGenerator = createJsonSchemaToSlideToggleGenerator(
  BergSlideToggleComponent,
  '@berglund/material'
);

export const tableGenerator = createJsonSchemaToTableGenerator(
  BergTableComponent,
  '@berglund/material'
);
