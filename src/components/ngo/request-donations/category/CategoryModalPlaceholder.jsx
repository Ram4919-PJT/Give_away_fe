/** Static placeholder controls for category modal — UI wireframe only */

export default function CategoryModalPlaceholder({ categoryId }) {
  const isClothes = categoryId === 'clothes';
  const isFood = categoryId === 'food';
  const isOther = categoryId === 'other';

  return (
    <div className="rd-cat-modal-fields">
      {!isOther && (
        <div>
          <label className="rd-cat-modal-field__label">
            {isFood ? 'Who is it for?' : isClothes ? 'Who are the clothes for?' : 'Audience'}
          </label>
          <div className="rd-cat-modal-pills">
            <span className="rd-cat-modal-pill is-active">Option A</span>
            <span className="rd-cat-modal-pill">Option B</span>
            <span className="rd-cat-modal-pill">Option C</span>
          </div>
        </div>
      )}

      {!isOther ? (
        <div>
          <label className="rd-cat-modal-field__label">Item types</label>
          <div className="rd-cat-modal-checks">
            <span className="rd-cat-modal-check is-checked">
              <span className="rd-cat-modal-check__box">✓</span>
              Item 1
            </span>
            <span className="rd-cat-modal-check">
              <span className="rd-cat-modal-check__box" />
              Item 2
            </span>
            <span className="rd-cat-modal-check is-checked">
              <span className="rd-cat-modal-check__box">✓</span>
              Item 3
            </span>
            <span className="rd-cat-modal-check">
              <span className="rd-cat-modal-check__box" />
              Item 4
            </span>
          </div>
        </div>
      ) : (
        <div>
          <label className="rd-cat-modal-field__label">Item name</label>
          <input
            readOnly
            placeholder="Enter custom item name"
            className="rd-cat-modal-input"
          />
        </div>
      )}

      <div>
        <label className="rd-cat-modal-field__label">Condition</label>
        <div className="rd-cat-modal-pills">
          <span className="rd-cat-modal-pill is-active">New</span>
          <span className="rd-cat-modal-pill">Gently Used</span>
        </div>
      </div>

      <div className="rd-cat-modal-row">
        <div>
          <label className="rd-cat-modal-field__label">Quantity</label>
          <input readOnly defaultValue="5" className="rd-cat-modal-input" />
        </div>
        <div>
          <label className="rd-cat-modal-field__label">Priority</label>
          <select disabled className="rd-cat-modal-select">
            <option>Select option</option>
          </select>
        </div>
      </div>

      <div>
        <label className="rd-cat-modal-field__label">Notes</label>
        <textarea
          readOnly
          rows={2}
          placeholder="Additional notes (wireframe placeholder)"
          className="rd-cat-modal-textarea"
        />
      </div>
    </div>
  );
}
