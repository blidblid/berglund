import { createBuilder } from '@angular-devkit/architect';
import { createWrappedBuilder } from '../create-wrapped-builder';

export default createBuilder(createWrappedBuilder('executeExtractI18nBuilder'));
