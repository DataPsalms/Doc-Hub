/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import WebhookUploader from './components/WebhookUploader';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <>
      <WebhookUploader />
      <Toaster position="top-center" />
    </>
  );
}
