/**
 * ===========================================================================
 * TAG SELECTOR COMPONENT - Category Selection and Management
 * ===========================================================================
 *
 * This component allows users to:
 * - Select from existing tags/categories
 * - Add new custom tags
 * - Persist tags in browser localStorage
 *
 * KEY REACT CONCEPTS DEMONSTRATED:
 * ---------------------------------
 *
 * 1. COMPONENT PROPS
 *    How to receive data from parent components via props
 *
 * 2. useState HOOK (Multiple State Variables)
 *    Managing local component state (tags list, form visibility, input value)
 *
 * 3. useEffect HOOK (Multiple Effects)
 *    - Loading data from localStorage on mount
 *    - Saving data to localStorage on changes
 *    - Syncing with parent component state
 *
 * 4. CONDITIONAL RENDERING
 *    Showing/hiding the "Add Tag" form based on state
 *
 * 5. LIST RENDERING with .map()
 *    Dynamically creating UI elements from an array
 *
 * 6. EVENT HANDLERS
 *    Responding to user interactions (clicks, input changes, keyboard events)
 *
 * 7. ACCESSIBILITY
 *    Using ARIA attributes and semantic HTML for screen readers
 */

import { useState, useEffect } from 'react';
import type { PomodoroMode } from '../types/pomodoro.types';

// ===========================================================================
// COMPONENT PROPS INTERFACE
// ===========================================================================

/**
 * TagSelectorProps
 * ----------------
 * Defines what props this component expects from its parent.
 *
 * WHAT ARE PROPS?
 * Props (short for "properties") are arguments passed to components.
 * They let parent components configure and communicate with child components.
 *
 * Think of props like function parameters:
 * - A function takes parameters: function greet(name) { ... }
 * - A component takes props: function TagSelector({ tag, setTag, mode }) { ... }
 *
 * PROPS ARE READ-ONLY:
 * A component cannot modify its own props. To change data, use the setter
 * functions provided by the parent (like setTag here).
 *
 * WHY USE AN INTERFACE FOR PROPS?
 * TypeScript checks that parent components pass all required props with
 * correct types. This catches errors at compile-time, not runtime.
 */
interface TagSelectorProps {
  /**
   * tag: The currently selected tag from the parent component
   * This is controlled by the parent (PomodoroContext), not by this component.
   */
  tag: string;

  /**
   * setTag: Function to update the selected tag in the parent
   * When we want to change the tag, we call this function.
   * The parent owns the state, we just request changes.
   */
  setTag: (tag: string) => void;

  /**
   * mode: Current timer mode ('work' or 'break')
   * We use this to disable tag selection during break periods.
   */
  mode: PomodoroMode;
}

// ===========================================================================
// COMPONENT DEFINITION
// ===========================================================================

/**
 * TagSelector Component
 * ---------------------
 * A functional component with props parameter.
 *
 * DESTRUCTURING PROPS:
 * Instead of: function TagSelector(props) { const tag = props.tag; ... }
 * We use: function TagSelector({ tag, setTag, mode }) { ... }
 *
 * This is cleaner and makes it obvious what props the component uses.
 *
 * TYPE ANNOTATION:
 * { tag, setTag, mode }: TagSelectorProps
 * TypeScript verifies the props match our interface definition.
 */
export function TagSelector({ tag, setTag, mode }: TagSelectorProps) {
  // ===========================================================================
  // LOCAL STATE - useState Hook
  // ===========================================================================

  /**
   * THE useState HOOK
   * -----------------
   * useState creates a state variable that persists across re-renders.
   *
   * SYNTAX:
   * const [value, setValue] = useState(initialValue);
   *
   * - value: The current state value
   * - setValue: Function to update the state
   * - initialValue: Starting value when component first mounts
   *
   * ARRAY DESTRUCTURING:
   * useState returns an array: [currentValue, setterFunction]
   * We use array destructuring to extract both:
   *   const stateArray = useState(0);
   *   const value = stateArray[0];
   *   const setValue = stateArray[1];
   * Shorthand: const [value, setValue] = useState(0);
   *
   * WHY USE STATE?
   * Regular variables reset on every render. State persists and causes
   * re-renders when updated, keeping the UI in sync with data.
   */

  /**
   * STATE 1: tags
   * -------------
   * Stores the list of available tags.
   *
   * TYPE: string[] (array of strings)
   * INITIAL VALUE: ['General', 'Work', 'Study']
   *
   * We start with three default tags. Users can add more.
   * This state is local to TagSelector - other components don't see it.
   */
  const [tags, setTags] = useState<string[]>(['General', 'Work', 'Study']);

  /**
   * STATE 2: showAddTag
   * -------------------
   * Controls visibility of the "Add Tag" form.
   *
   * TYPE: boolean
   * INITIAL VALUE: false (form hidden)
   *
   * When user clicks "➕ Add Tag" button, we set this to true.
   * This shows the input field and Add/Cancel buttons.
   */
  const [showAddTag, setShowAddTag] = useState<boolean>(false);

  /**
   * STATE 3: newTagName
   * -------------------
   * Stores the text user types into the "new tag" input field.
   *
   * TYPE: string
   * INITIAL VALUE: '' (empty string)
   *
   * This is a CONTROLLED INPUT pattern (explained later).
   */
  const [newTagName, setNewTagName] = useState<string>('');

  // ===========================================================================
  // SIDE EFFECTS - useEffect Hooks
  // ===========================================================================

  /**
   * EFFECT 1: Load tags from localStorage on component mount
   * ---------------------------------------------------------
   *
   * WHEN DOES THIS RUN?
   * - Once when the component first mounts (appears on screen)
   * - Never again (because dependency array is empty [])
   *
   * WHAT IS localStorage?
   * Browser API for storing data persistently (survives page refreshes).
   * - localStorage.setItem(key, value): Save data
   * - localStorage.getItem(key): Retrieve data
   * - localStorage.removeItem(key): Delete data
   * Data is stored as strings, so we use JSON.parse/stringify for objects/arrays.
   *
   * WHY EMPTY DEPENDENCY ARRAY []?
   * We only want to load saved tags once when component first appears.
   * If we omitted [], this would run after every render (infinite loop risk!).
   */
  useEffect(() => {
    // Try to get saved tags from localStorage
    const savedTags = localStorage.getItem('pomodoroTags');

    // If there are saved tags, parse and use them
    if (savedTags) {
      try {
        /**
         * JSON PARSING WITH TYPE ASSERTION
         * --------------------------------
         * JSON.parse() returns 'any' type (TypeScript doesn't know what it is).
         * We use 'as string[]' to tell TypeScript "trust me, this is a string array".
         *
         * This is called a TYPE ASSERTION or TYPE CAST.
         * Use carefully - if the data isn't actually string[], errors will occur at runtime.
         */
        const parsed = JSON.parse(savedTags) as string[];
        setTags(parsed);
      } catch {
        /**
         * ERROR HANDLING
         * --------------
         * If JSON.parse() fails (corrupted data), we catch the error and ignore it.
         * This prevents the app from crashing.
         * We use an empty catch block because we're okay with just using default tags.
         */
        // Ignore parse errors - will use default tags
      }
    }
  }, []); // Empty array = run once on mount

  /**
   * EFFECT 2: Save tags to localStorage whenever they change
   * ---------------------------------------------------------
   *
   * WHEN DOES THIS RUN?
   * - After the component mounts
   * - After every render where 'tags' has changed
   *
   * DEPENDENCY ARRAY: [tags]
   * This effect depends on 'tags'. When tags changes, save to localStorage.
   *
   * WHY SEPARATE EFFECT?
   * We keep loading and saving in separate effects because:
   * 1. They run at different times (load once, save on changes)
   * 2. Different dependency arrays
   * 3. Easier to understand and maintain
   */
  useEffect(() => {
    /**
     * JSON STRINGIFICATION
     * --------------------
     * localStorage can only store strings, not arrays/objects.
     * JSON.stringify() converts JavaScript values to JSON string format.
     *
     * Example:
     * ['Work', 'Study'] → '["Work","Study"]'
     */
    localStorage.setItem('pomodoroTags', JSON.stringify(tags));
  }, [tags]); // Run whenever 'tags' changes

  /**
   * EFFECT 3: Ensure UI has a selected tag on mount and sync with context
   * ----------------------------------------------------------------------
   *
   * WHEN DOES THIS RUN?
   * - After the component mounts
   * - Whenever 'tag' prop changes (parent updates the selected tag)
   *
   * WHY IS THIS NEEDED?
   * 1. If no tag is selected (empty string), default to 'General'
   * 2. If the selected tag doesn't exist in our tags list, add it
   *    This handles edge cases where the tag comes from saved context state
   *
   * DEPENDENCY ARRAY: [tag]
   * We intentionally omit setTag and setTags to avoid triggering this effect
   * when those functions change. See the eslint-disable comment.
   */
  useEffect(() => {
    // Case 1: No tag selected - default to 'General'
    if (!tag || tag.trim() === '') {
      setTag('General');
      return; // Exit early, no need to continue
    }

    // Case 2: Selected tag doesn't exist in our list - add it
    if (!tags.includes(tag)) {
      /**
       * FUNCTIONAL STATE UPDATE WITH PREVIOUS STATE
       * --------------------------------------------
       * setTags((prev) => [tag, ...prev])
       *
       * This pattern is used when new state depends on old state.
       * - prev: The current tags array
       * - [tag, ...prev]: Create new array with tag first, then existing tags
       * - ... is the SPREAD OPERATOR - it "spreads" array elements
       *
       * Example:
       * prev = ['Work', 'Study']
       * tag = 'Exercise'
       * [tag, ...prev] → ['Exercise', 'Work', 'Study']
       *
       * WHY FUNCTIONAL UPDATE?
       * Guarantees we're working with the latest state, even if multiple
       * updates happen quickly. Same reason as in Timer component.
       */
      setTags((prev) => [tag, ...prev]);
    }

    /**
     * DISABLING ESLINT RULE
     * ----------------------
     * eslint-disable-line react-hooks/exhaustive-deps
     *
     * React's linter wants us to include setTag and setTags in dependencies.
     * We intentionally omit them because:
     * - They're stable functions (don't change between renders)
     * - Including them might cause unnecessary effect runs
     *
     * This is an advanced pattern - beginners should usually follow the linter!
     */
  }, [tag]); // eslint-disable-line react-hooks/exhaustive-deps

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================

  /**
   * handleAddTag
   * ------------
   * Adds a new tag to the tags list.
   *
   * WHEN IS THIS CALLED?
   * - When user clicks the "Add" button
   * - When user presses Enter in the input field
   *
   * VALIDATION:
   * We check two conditions before adding:
   * 1. Tag name is not empty (after trimming whitespace)
   * 2. Tag doesn't already exist (no duplicates)
   */
  const handleAddTag = () => {
    // Remove leading/trailing whitespace
    const trimmedTag = newTagName.trim();

    // Validate: non-empty and unique
    if (trimmedTag && !tags.includes(trimmedTag)) {
      /**
       * ADD NEW TAG TO LIST
       * -------------------
       * [...tags, trimmedTag] creates a new array with all existing tags
       * plus the new one at the end.
       *
       * IMMUTABILITY:
       * We don't do: tags.push(trimmedTag)
       * Why? React state should never be mutated directly.
       * Always create a new array/object when updating state.
       */
      setTags([...tags, trimmedTag]);

      // Automatically select the newly created tag
      setTag(trimmedTag);

      // Clear the input field
      setNewTagName('');

      // Hide the add tag form
      setShowAddTag(false);
    }
  };

  /**
   * handleSelectTag
   * ---------------
   * Selects a tag when user clicks on it.
   *
   * PARAMETERS:
   * @param selectedTag - The tag that was clicked
   *
   * This calls the setTag function passed from the parent,
   * updating the selected tag in the global context.
   */
  const handleSelectTag = (selectedTag: string) => {
    setTag(selectedTag);
  };

  // ===========================================================================
  // JSX RETURN - Component UI
  // ===========================================================================

  return (
    <div className="tag-selector">
      <h3>Select Category</h3>

      {/* TAG BUTTONS LIST */}
      <div className="tags-list">
        {/**
         * LIST RENDERING WITH .map()
         * ---------------------------
         * .map() transforms each array element into JSX.
         *
         * SYNTAX:
         * array.map((item) => <Element key={item.id}>...</Element>)
         *
         * For each tag in the tags array, we create a <button> element.
         *
         * THE KEY PROP:
         * key={t} is CRITICAL for React's performance.
         *
         * Why does React need keys?
         * When the list changes, React uses keys to:
         * - Track which items changed/added/removed
         * - Reorder elements efficiently without recreating them
         * - Preserve component state
         *
         * Keys must be:
         * - Unique among siblings (but not globally)
         * - Stable (same item = same key across renders)
         * - Not the array index (unless list never reorders)
         *
         * Since tag names are unique, we can use them as keys.
         */}
        {tags.map((t) => (
          <button
            key={t} // Unique identifier for React's reconciliation
            type="button" // Prevents form submission if inside a form
            className={`tag-btn ${t === tag ? 'active' : ''}`} // Dynamic class
            onClick={() => handleSelectTag(t)} // Arrow function to pass parameter
            disabled={mode === 'break'} // Disable during break mode
            aria-pressed={t === tag} // Accessibility: tells screen readers if button is "pressed"
          >
            {/**
             * TEMPLATE LITERALS IN CLASSNAME
             * -------------------------------
             * className={`tag-btn ${t === tag ? 'active' : ''}`}
             *
             * This creates dynamic classes:
             * - Always has 'tag-btn' class
             * - Adds 'active' class if this tag is currently selected
             *
             * Example:
             * If t='Work' and tag='Work': className="tag-btn active"
             * If t='Study' and tag='Work': className="tag-btn "
             *
             * CSS can then style .tag-btn.active differently.
             */}

            {/**
             * ARROW FUNCTION IN onClick
             * --------------------------
             * onClick={() => handleSelectTag(t)}
             *
             * WHY THE ARROW FUNCTION?
             * We need to pass the specific tag 't' to the handler.
             *
             * ❌ onClick={handleSelectTag(t)}
             *    This calls handleSelectTag immediately during render!
             *
             * ✅ onClick={() => handleSelectTag(t)}
             *    This creates a function that React calls on click.
             *
             * ALTERNATIVE: onClick={handleSelectTag.bind(null, t)}
             * But arrow functions are more common and readable.
             */}

            {/**
             * DISABLED ATTRIBUTE
             * ------------------
             * disabled={mode === 'break'}
             *
             * When mode is 'break', this evaluates to:
             * disabled={true} → button cannot be clicked
             *
             * When mode is 'work', this evaluates to:
             * disabled={false} → button works normally
             *
             * This prevents users from changing categories during break time.
             */}

            {/**
             * ARIA-PRESSED ATTRIBUTE
             * ----------------------
             * aria-pressed={t === tag}
             *
             * Accessibility attribute for screen readers.
             * Indicates whether this toggle button is in a pressed state.
             *
             * - aria-pressed="true": This tag is selected
             * - aria-pressed="false": This tag is not selected
             *
             * Screen readers announce "Work, button, pressed" vs "Study, button, not pressed"
             */}
            {t}
          </button>
        ))}
      </div>

      {/* ADD TAG SECTION */}
      <div className="add-tag-section">
        {/**
         * CONDITIONAL RENDERING
         * ---------------------
         * We use a ternary operator to show different UI based on state.
         *
         * Pattern: {condition ? <ComponentA /> : <ComponentB />}
         *
         * If showAddTag is false: Show the "➕ Add Tag" button
         * If showAddTag is true: Show the form with input and buttons
         */}
        {!showAddTag ? (
          // CASE 1: Form is hidden - show "Add Tag" button
          <button
            type="button"
            className="add-tag-btn"
            onClick={() => setShowAddTag(true)} // Show the form when clicked
            disabled={mode === 'break'} // Disable during break time
          >
            ➕ Add Tag
          </button>
        ) : (
          // CASE 2: Form is visible - show input and action buttons
          <div className="add-tag-form">
            {/**
             * CONTROLLED INPUT PATTERN
             * ------------------------
             * A controlled input's value is controlled by React state.
             *
             * ATTRIBUTES:
             * - value={newTagName}: Input displays whatever's in state
             * - onChange={(e) => setNewTagName(e.target.value)}: Update state on every keystroke
             *
             * DATA FLOW:
             * 1. User types character → onChange event fires
             * 2. Event handler calls setNewTagName with new value
             * 3. State updates, component re-renders
             * 4. Input displays new state value
             *
             * This makes the input's value always match the state.
             * We have a "single source of truth" - the state variable.
             *
             * UNCONTROLLED INPUT (alternative):
             * <input defaultValue="..." ref={inputRef} />
             * Value is managed by the DOM, not React.
             * We rarely use this in modern React.
             */}
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Tag name..."
              autoFocus // Automatically focus this input when it appears
            />

            {/**
             * ONKEYPRESS EVENT
             * ----------------
             * onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
             *
             * This allows users to press Enter to submit instead of clicking Add.
             *
             * BREAKDOWN:
             * - e: KeyboardEvent object
             * - e.key: String representing the key pressed ('Enter', 'a', 'Shift', etc.)
             * - e.key === 'Enter': Check if Enter was pressed
             * - && handleAddTag(): If true, call handleAddTag (short-circuit evaluation)
             *
             * SHORT-CIRCUIT EVALUATION:
             * condition && action
             * If condition is false, action never runs.
             * If condition is true, action runs.
             *
             * This is equivalent to:
             * if (e.key === 'Enter') {
             *   handleAddTag();
             * }
             */}

            <button type="button" onClick={handleAddTag}>
              Add
            </button>

            {/**
             * CANCEL BUTTON
             * -------------
             * Resets the form state without adding a tag.
             *
             * When clicked:
             * 1. Hide the form (setShowAddTag(false))
             * 2. Clear any text in the input (setNewTagName(''))
             *
             * This is a "cleanup" action that returns UI to initial state.
             */}
            <button
              type="button"
              onClick={() => {
                setShowAddTag(false);
                setNewTagName('');
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
