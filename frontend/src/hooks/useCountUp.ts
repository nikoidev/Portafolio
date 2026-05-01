'use client';

import { animate, useInView, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function useCountUp(target: number, duration = 1.8) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-60px' });
    const motionValue = useMotionValue(0);
    const rounded = useTransform(motionValue, (v) => Math.round(v).toLocaleString());
    const [display, setDisplay] = useState('0');

    useEffect(() => {
        const unsubscribe = rounded.on('change', (v) => setDisplay(v));
        return unsubscribe;
    }, [rounded]);

    useEffect(() => {
        if (!isInView) return;
        const controls = animate(motionValue, target, { duration, ease: 'easeOut' });
        return controls.stop;
    }, [isInView, target, duration, motionValue]);

    return { ref, display };
}
