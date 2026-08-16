import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';

import { AppTabBar } from '@/components/tab-bar';

export default function TabsLayout() {
  return (
    <Tabs style={{ flex: 1 }}>
      <TabSlot style={{ flex: 1 }} />

      <TabList style={{ display: 'none' }}>
        <TabTrigger name="index" href="/" />
        <TabTrigger name="files" href="/files" />
        <TabTrigger name="calendar" href="/calendar" />
        <TabTrigger name="profile" href="/profile" />
      </TabList>

      <AppTabBar />
    </Tabs>
  );
}
