import { registerModules } from './register-modules';

import settingsModule from './settings';
import zReportModule from './z-report';
import orderModule from './order';

registerModules({
  settings: settingsModule,
  zReport: zReportModule,
  order: orderModule,
});
