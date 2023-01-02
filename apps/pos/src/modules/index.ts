import settingsModule from './settings';
import zReportModule from './z-report';
import orderModule from './order';

import { registerModules } from './register-modules';

registerModules({
  settings: settingsModule,
  zReport: zReportModule,
  order: orderModule,
});
