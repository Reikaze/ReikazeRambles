/**
 * ⚠ A WARNING TO ALL YE WHO TRAVEL NEAR ⚠️
 * Life would be dull if we never explored, never played
 * However, deadlines near ever-closer and when one's played too long, they may
 * forget to put away their toys in an orderly manor. This is what's occurred
 *
 * It is for this reason that this code is deemed a hazard to one's health.
 * Ye've been warned
 *
 * This is a hand-spun component to match the guidelines for a listbox ALA w3 guidelines
 * @see https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html
 *
 * ✅ Escape - Collapse the dropdown
 * ✅ Up - Focus previous item
 * ✅ Down - Focus next item
 * ✅ Home - Goes to first item
 * ✅ End - Goes to last item
 * ✅ Space - Toggles selection of item
 * ✅ Shift + Down - Focuses and selects next item
 * ✅ Shift + Up - Focuses and selects previous item
 * ✅ Ctrl + Shift + Home - Selects from the focused option to start of list
 * ✅ Ctrl + Shift + End - Selects from the focused option to end of list
 * ✅ Ctrl + A - Toggles selection of all
 * 🔲 Click outside this component to close
 * Am I supposed to focus lock w/ tab?
 * 🔲 If so, add that
 * 🔲 If not, close on `blur`
 */

/**
 * "Filters"
 * Click to expand
 * Clicking filters won't do anything
 * After not expanded, show the filters by animating away "filters"
 * If nothing is selected, don't animate away "Filters"
 */

import React, {
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef
} from "react";
import classNames from "classnames";
import posed from "react-pose";

import filterStyles from "./filter-listbox.module.scss";

import FilterIcon from "../../../assets/icons/filter.svg";
import CheckIcon from "../../../assets/icons/check.svg";
import UncheckIcon from "../../../assets/icons/unchecked.svg";

import { useSelectRef } from "../../../utils/a11y/useSelectRef";
import { useWindowSize } from "../../../utils/useWindowSize";
import { useAfterInit } from "../../../utils/useAfterInit";
import { useLunr } from "../../../utils/useLunr";
import { SearchAndFilterContext } from "../../search-and-filter-context";

const FilterListItem = ({ tag, index, active, expanded, selectIndex }) => {
	const liClassName = classNames(filterStyles.option, {
		[filterStyles.active]: active.index === index,
		[filterStyles.selected]: tag.selected,
		[filterStyles.expanded]: expanded
	});
	return (
		<li
			className={liClassName}
			role="option"
			onClick={e => expanded && selectIndex(index, e, e.type)}
			id={tag.id}
			aria-selected={tag.selected}
		>
			{tag.selected ? <CheckIcon /> : <UncheckIcon />}
			<span>{tag.val}</span>
		</li>
	);
};

const FilterDisplaySpan = posed.span({
	initial: {
		width: props => props.wiidth || 0,
		height: props => props.heiight
	}
});

const ListIdBox = posed.ul({
	expanded: {
		height: "auto"
	},
	hidden: {
		height: props => props.heiight
	}
});

export const FilterListbox = ({ tags = [], className }) => {
	const { setFilterVal } = useContext(SearchAndFilterContext);
	const {
		ref: listBoxRef,
		active,
		values,
		selected,
		selectIndex,
		expanded,
		usedKeyboardLast,
		parentRef,
		buttonProps
	} = useSelectRef(tags, "multi");

	useLayoutEffect(() => {
		setFilterVal(selected || []);
	}, [selected, setFilterVal]);

	const shouldShowFilterMsg = expanded || !selected.length;

	/**
	 * Refs
	 */
	const filterTextRef = useRef();
	const appliedFiltersTextRef = useRef();
	const btnRef = useRef();
	const containerRef = useRef();

	const windowSize = useWindowSize(150);

	/**
	 * Effects
	 */
	useEffect(() => {
		// When user escapes using "Esc" key, refocus on btn
		if (!expanded && usedKeyboardLast && btnRef.current) {
			btnRef.current.focus();
		}
	}, [expanded, usedKeyboardLast, btnRef]);

	/**
	 * Value calcs
	 */
	const appliedTagsStr = useMemo(() => {
		if (!selected.length) return "";
		return selected.map(v => v.val).join(", ");
	}, [selected]);

	/**
	 * Bounding Box Matches
	 */

	// Make bounding boxes work properly
	const afterInit = useAfterInit();

	const currentSpanHeight = useMemo(() => {
		if (!filterTextRef.current || !filterTextRef.current) return 0;
		const filtTxtBound = filterTextRef.current.getBoundingClientRect();
		const appliedFiltBound = appliedFiltersTextRef.current.getBoundingClientRect();
		return filtTxtBound.height < appliedFiltBound.height
			? appliedFiltBound.height
			: filtTxtBound.height;
	}, [appliedFiltersTextRef, filterTextRef]);

	const currentBtnHeight = useMemo(() => {
		if (!btnRef.current) return 0;
		const btnRefBound = btnRef.current.getBoundingClientRect();
		return btnRefBound.height;
	}, []);

	const currentSpanWidth = useMemo(() => {
		if (!filterTextRef.current || !filterTextRef.current) return 0;
		if (shouldShowFilterMsg) {
			const filtTxtBound = filterTextRef.current.getBoundingClientRect();
			let toReturn = filtTxtBound.width;
			if (expanded) {
				toReturn += 100;
			}
			return toReturn;
		}

		const appliedFiltBound = appliedFiltersTextRef.current.getBoundingClientRect();
		return appliedFiltBound.width;
	}, [shouldShowFilterMsg, expanded]);

	const maxSpanWidth = useMemo(() => {
		if (!containerRef.current) return 0;
		const containerRefBounding = containerRef.current.getBoundingClientRect();
		return containerRefBounding.width;
	}, [containerRef]);

	/**
	 * Class names
	 */
	const containerClassName = useMemo(
		() =>
			classNames({
				[filterStyles.expanded]: expanded,
				[filterStyles.container]: true,
				[className || ""]: true
			}),
		[className, expanded]
	);

	const filterIconClasses = useMemo(
		() =>
			classNames({
				expandedIcon: expanded,
				[filterStyles.icon]: true
			}),
		[expanded]
	);

	const listBoxClasses = useMemo(
		() =>
			classNames({
				[filterStyles.hasTags]: !!selected.length,
				[filterStyles.listbox]: true,
				[filterStyles.isKeyboard]: usedKeyboardLast
			}),
		[usedKeyboardLast, selected]
	);

	const filterTextClasses = useMemo(
		() =>
			classNames({
				[filterStyles.show]: shouldShowFilterMsg,
				[filterStyles.placeholder]: true
			}),
		[shouldShowFilterMsg]
	);

	const appliedStrClasses = useMemo(
		() =>
			classNames({
				[filterStyles.show]: !shouldShowFilterMsg,
				[filterStyles.appliedTags]: true
			}),
		[shouldShowFilterMsg]
	);

	return (
		<div className={containerClassName} ref={containerRef}>
			<div className={filterStyles.buttonContainer} ref={parentRef}>
				<span id="exp_elem" className="visually-hidden">
					Choose a tag to filter by:
				</span>
				<button
					type="button"
					ref={btnRef}
					className={filterStyles.filterButton}
					aria-haspopup="listbox"
					aria-expanded={expanded}
					aria-labelledby="exp_elem filter-button"
					aria-owns="listBoxID"
					id="filter-button"
					{...buttonProps}
				>
					{<FilterIcon className={filterIconClasses} aria-hidden={true} />}
					<FilterDisplaySpan
						className={filterStyles.textContainer}
						heiight={currentSpanHeight}
						pose="initial"
						poseKey={currentSpanWidth}
						wiidth={currentSpanWidth}
					>
						<span
							ref={filterTextRef}
							aria-hidden={true}
							className={filterTextClasses}
						>
							Filters
						</span>
						<span
							ref={appliedFiltersTextRef}
							className={appliedStrClasses}
							style={{ maxWidth: maxSpanWidth }}
						>
							{appliedTagsStr}
						</span>
					</FilterDisplaySpan>
				</button>
				<ListIdBox
					id="listBoxID"
					role="listbox"
					ref={listBoxRef}
					className={listBoxClasses}
					aria-labelledby="exp_elem"
					tabIndex={-1}
					aria-multiselectable="true"
					aria-activedescendant={active && active.id}
					heiight={currentBtnHeight}
					poseKey={currentBtnHeight}
					pose={expanded ? "expanded" : "hidden"}
				>
					<div className={filterStyles.maxHeightHideContainer}>
						<div className={filterStyles.spacer} />
						{values.map((tag, index) => (
							<FilterListItem
								tag={tag}
								key={tag.id}
								index={index}
								expanded={expanded}
								selectIndex={selectIndex}
								active={active}
							/>
						))}
					</div>
				</ListIdBox>
			</div>
		</div>
	);
};
