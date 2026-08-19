import { CurvedBottomBarExpo } from 'react-native-curved-bottom-bar';
import { useColorScheme, useWindowDimensions } from 'react-native';

import { ChatCircleButton, TabBarItem } from '@/components/tab-bar';

import CalendarScreen from './calendar';
import FilesScreen from './files';
import HomeScreen from './index';
import ProfileScreen from './profile';

type TabBarRenderArgs = {
  routeName: string;
  selectedTab: string;
  navigate: (routeName: string) => void;
};

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width } = useWindowDimensions();

  return (
    <CurvedBottomBarExpo.Navigator
      type="DOWN"
      circlePosition="CENTER"
      initialRouteName="index"
      height={64}
      width={width}
      id={undefined}
      style={undefined}
      screenListeners={undefined}
      screenOptions={undefined}
      defaultScreenOptions={undefined}
      backBehavior={undefined}
      circleWidth={56}
      bgColor={isDark ? '#000000' : '#FFFFFF'}
      borderColor={isDark ? '#262626' : '#E3ECFB'}
      borderWidth={1}
      borderTopLeftRight={false}
      shadowStyle={undefined}
      renderCircle={() => <ChatCircleButton />}
      tabBar={({ routeName, selectedTab, navigate }: TabBarRenderArgs) => (
        <TabBarItem routeName={routeName} selectedTab={selectedTab} navigate={navigate} />
      )}>
      <CurvedBottomBarExpo.Screen name="index" position="LEFT" component={() => <HomeScreen />} />
      <CurvedBottomBarExpo.Screen name="files" position="LEFT" component={() => <FilesScreen />} />
      <CurvedBottomBarExpo.Screen
        name="calendar"
        position="RIGHT"
        component={() => <CalendarScreen />}
      />
      <CurvedBottomBarExpo.Screen
        name="profile"
        position="RIGHT"
        component={() => <ProfileScreen />}
      />
    </CurvedBottomBarExpo.Navigator>
  );
}
