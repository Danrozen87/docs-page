# Collet Angular Reference

Angular wrappers for the Collet component library. Auto-generated from
`custom-elements.json` via `scripts/generate-angular.mjs`.

---

## Package

```
@colletdev/angular
```

**Peer dependencies:** `@angular/core >= 16.0.0`, `@angular/forms >= 16.0.0` (optional), `@colletdev/core >= 0.1.0`

Ships raw TypeScript source — consumers compile with their own Angular toolchain.

## Architecture

Angular wrappers are standalone components with `CUSTOM_ELEMENTS_SCHEMA`,
`ChangeDetectionStrategy.OnPush`, and `c.detach()` for zero change detection
overhead. They handle:

- **Attribute serialization** — objects/arrays synced via `ngOnChanges` + `setAttribute`
- **Event bridging** — `@Output()` EventEmitters for `cx-{event}` CustomEvents
- **Slot projection** — `<ng-content>` with `select="[slot=name]"` for named slots
- **ControlValueAccessor** — form-associated components support `formControlName` and `ngModel`
- **Imperative methods** — public methods on the component class delegating to the CE

### Package Structure

```
packages/angular/
  src/                        ← Auto-generated wrappers (DO NOT EDIT)
    button.component.ts
    dialog.component.ts
    ...
    index.ts                  ← Barrel exports
    types.ts                  ← Shared TypeScript interfaces
```

### Selector Pattern

```
cx-{name}[collet]
```

The `[collet]` attribute disambiguates the Angular wrapper from the bare
Custom Element. This means Angular components must add the `collet` attribute:

```html
<cx-button collet label="Click me" />
```

---

## Patterns

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { CxButton, CxDialog } from '@colletdev/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CxButton, CxDialog],
  template: `
    <cx-button collet label="Open" (cxClick)="dialog.open()" />
    <cx-dialog collet
      #dialog
      title="Confirm"
      (cxClose)="onClose($event)"
    >
      <p>Are you sure?</p>
      <div slot="footer">
        <cx-button collet label="OK" variant="filled" />
      </div>
    </cx-dialog>
  `,
})
export class AppComponent {
  onClose(e: CustomEvent) {
    console.log(e.detail.reason);
  }
}
```

### Event Handling

Events use `(cxEventName)` syntax:

```html
<cx-text-input collet
  label="Email"
  (cxInput)="onInput($event)"
  (cxChange)="onChange($event)"
  (cxFocus)="onFocus($event)"
  (cxKeydown)="onKeydown($event)"
/>
```

```typescript
onInput(e: CustomEvent<InputDetail>) {
  this.value = e.detail.value;
}
```

### Imperative Methods

Access methods directly on the component instance via template ref:

```html
<cx-select collet #selectRef label="Country" [items]="countries" />
<button (click)="selectRef.open()">Open</button>
```

Or via `@ViewChild`:

```typescript
@ViewChild('selectRef') selectRef!: CxSelect;

openSelect() {
  this.selectRef.open();
}
```

### Named Slots

Project content into named slots using the `slot` attribute:

```html
<cx-card collet>
  <div slot="header"><h3>Title</h3></div>
  <p>Body content</p>
  <div slot="footer">
    <cx-button collet label="Action" />
  </div>
</cx-card>
```

The wrapper template includes `<ng-content select="[slot=name]">` for each
named slot, so Angular's content projection passes through to Shadow DOM.

### Complex Props (Structured Data)

Props accepting arrays/objects use `[attr]` binding. The wrapper watches for
changes and serializes via `JSON.stringify` + `setAttribute`:

```html
<cx-table collet
  caption="Users"
  [columns]="columns"
  [rows]="rows"
  [sorts]="[{ column_id: 'name', direction: 'asc' }]"
  (cxSort)="handleSort($event)"
/>
```

### Reactive Forms (ControlValueAccessor)

Form-associated components implement `ControlValueAccessor` for Angular
Reactive Forms and `ngModel`:

```typescript
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CxTextInput, CxSelect, CxCheckbox } from '@colletdev/angular';

@Component({
  imports: [ReactiveFormsModule, CxTextInput, CxSelect, CxCheckbox],
  template: `
    <form [formGroup]="form">
      <cx-text-input collet formControlName="email" label="Email" />
      <cx-select collet formControlName="country" label="Country" [items]="countries" />
      <cx-checkbox collet formControlName="agree" label="I agree" />
    </form>
  `,
})
export class FormComponent {
  form = new FormGroup({
    email: new FormControl(''),
    country: new FormControl(''),
    agree: new FormControl(false),
  });
}
```

**CVA components:** TextInput, Select, Checkbox, RadioGroup, Switch, Slider,
Autocomplete, ToggleGroup, DatePicker, SearchBar, ChatInput.

The CVA implementation:
- `writeValue()` — sets the CE's `value` (or `checked` for checkbox/switch)
- `registerOnChange()` — listens to `cx-change` events
- `registerOnTouched()` — listens to `focusout`
- `setDisabledState()` — toggles the `disabled` attribute

### DOM Collision Handling

Attributes like `title`, `width`, `loading` are bound via `[attr.name]` to
avoid Angular setting them as DOM properties:

```html
<!-- Works correctly -->
<cx-dialog collet [attr.title]="dialogTitle" />
<cx-table collet [attr.loading]="loadPercent" />
```

---

## TypeScript

### Type Imports

```typescript
import type {
  TableColumn, TableRow, SelectOption, MenuEntry,
  InputDetail, ClickDetail, CloseDetail, FocusDetail,
} from '@colletdev/angular';
```

### Component Classes

All wrappers export PascalCase classes prefixed with `Cx`:

```typescript
import {
  CxButton,      // <cx-button collet>
  CxDialog,      // <cx-dialog collet>
  CxTextInput,   // <cx-text-input collet>
  CxTable,       // <cx-table collet>
} from '@colletdev/angular';
```

---

## Performance

The wrappers use `ChangeDetectionStrategy.OnPush` with `c.detach()` in the
constructor, so Angular's change detection never runs for these components.
All reactivity is handled by the Custom Element itself and the `watch` /
`ngOnChanges` attribute syncing.

---

## Codegen

Angular wrappers are generated by `scripts/generate-angular.mjs`. Configuration
lives in `scripts/component-config.mjs` (shared across all framework generators).

**Do not edit** files in `packages/angular/src/` — they are overwritten by
`bash scripts/build-packages.sh`.

Raw TypeScript ships to consumers (compile with `tsc` or `ng-packagr`).
