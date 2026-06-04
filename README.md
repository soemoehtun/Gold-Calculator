# Gold Calculator

Myanmar gold weight and value converter. Convert between MMK and traditional Myanmar gold units (Kyat, Pae, Yway).

## Features

- **Buy Mode** (ရွှေဝယ်မယ်): Convert MMK to gold weight (Kyat/Pae/Yway)
- **Sell Mode** (ရွှေပြန်ရောင်းမယ်): Convert gold weight to MMK value
- Supports Myanmar/English digit input
- Responsive design matching Cell ID Calculator theme

## Usage

1. Select mode (Buy or Sell)
2. Enter the required values
3. Press **Calculate**

### Conversion Reference

| Unit | Equivalent |
|------|------------|
| 1 Kyat (ကျပ်) | 16 Pae (ပဲ) |
| 1 Pae (ပဲ) | 8 Yway (ရွှေး) |
| 1 Kyat | 128 Yway |

### Formulas

- **Weight (Kyat) = MMK ÷ Gold Price**
- **Value (MMK) = (Kyat + Pae/16 + Yway/128) × Gold Price**

## Files

- `index.html` — standalone single-file version
