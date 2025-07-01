# Code Examples Document

## Python Example
Here's a simple Python function:

```python
def calculate_total(items):
    """
    Calculate the total price of all items.
    
    Args:
        items: List of dictionaries with 'price' key
        
    Returns:
        float: Total price
    """
    total = 0
    for item in items:
        total += item['price']
    return total

# Example usage
items = [
    {'name': 'Product A', 'price': 100},
    {'name': 'Product B', 'price': 200},
    {'name': 'Product C', 'price': 150}
]

print(f"Total price: ${calculate_total(items)}")
```

## Bash Example
Here's a bash script for monitoring:

```bash
#!/bin/bash

# Check system status
echo "Checking system status at $(date)"

# Check disk space
echo "Disk space usage:"
df -h | grep '/dev/sda'

# Check memory usage
echo "Memory usage:"
free -m

# Check CPU load
echo "CPU load:"
uptime
```

## JSON Configuration
Here's a sample configuration:

```json
{
  "appName": "MyApplication",
  "version": "1.0.0",
  "settings": {
    "maxUsers": 100,
    "timeout": 30,
    "features": ["login", "dashboard", "reports"]
  },
  "database": {
    "host": "db.example.com",
    "port": 5432,
    "credentials": {
      "username": "admin",
      "password": "s3cr3t"
    }
  }
}
``` 