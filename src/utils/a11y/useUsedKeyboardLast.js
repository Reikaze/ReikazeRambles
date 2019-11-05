import { useCallback, useEffect, useState } from "react";

/**
 * A hook to handle when the keyboard was used last
 *
 * It's impossible (and non-performant) to handle all events,
 * so we're having the consumer themselves handle when to set the value to
 * false by returning the function `resetLastUsedKeyboard`
 *
 * @param {React.RefObject} ref
 * @param {boolean} enable
 * @returns {{resetLastUsedKeyboard: Function, usedKeyboardLast: boolean}}
 */
export const useUsedKeyboardLast = (ref, enable) => {
	const [usedKeyboardLast, setUsedKeyboardLast] = useState(false);

	const resetLastUsedKeyboard = useCallback(
		() => setUsedKeyboardLast(false),
		[]
	);

	useEffect(() => {
		const currRef = ref && ref.current;
		const setUsedKeyboardLastToTrue = () => setUsedKeyboardLast(true);

		if (enable && currRef) {
			currRef.addEventListener("keydown", setUsedKeyboardLastToTrue);

			return () => {
				currRef.removeEventListener("keydown", setUsedKeyboardLastToTrue);
			};
		}
	}, [enable, ref]);

	return {
		usedKeyboardLast,
		resetLastUsedKeyboard
	};
};
