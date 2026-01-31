import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  devicePixelRatio: number;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouchDevice: false,
        screenWidth: 1920,
        screenHeight: 1080,
        orientation: 'landscape',
        devicePixelRatio: 1,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      isMobile: width < MOBILE_BREAKPOINT,
      isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
      isDesktop: width >= TABLET_BREAKPOINT,
      isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      screenWidth: width,
      screenHeight: height,
      orientation: width > height ? 'landscape' : 'portrait',
      devicePixelRatio: window.devicePixelRatio || 1,
    };
  });

  React.useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDeviceInfo({
        isMobile: width < MOBILE_BREAKPOINT,
        isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
        isDesktop: width >= TABLET_BREAKPOINT,
        isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        screenWidth: width,
        screenHeight: height,
        orientation: width > height ? 'landscape' : 'portrait',
        devicePixelRatio: window.devicePixelRatio || 1,
      });
    };

    const mediaQueryMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const mediaQueryTablet = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT - 1}px)`);
    const orientationQuery = window.matchMedia('(orientation: portrait)');

    mediaQueryMobile.addEventListener('change', updateDeviceInfo);
    mediaQueryTablet.addEventListener('change', updateDeviceInfo);
    orientationQuery.addEventListener('change', updateDeviceInfo);
    window.addEventListener('resize', updateDeviceInfo);

    return () => {
      mediaQueryMobile.removeEventListener('change', updateDeviceInfo);
      mediaQueryTablet.removeEventListener('change', updateDeviceInfo);
      orientationQuery.removeEventListener('change', updateDeviceInfo);
      window.removeEventListener('resize', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
}

export function useTouchGestures() {
  const [touchStart, setTouchStart] = React.useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<{ x: number; y: number } | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    return {
      isLeftSwipe,
      isRightSwipe,
      isUpSwipe,
      isDownSwipe,
      distanceX: Math.abs(distanceX),
      distanceY: Math.abs(distanceY),
    };
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
