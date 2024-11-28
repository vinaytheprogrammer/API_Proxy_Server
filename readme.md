### **README: Simple API Proxy Server**

---

## **Overview**
This Node.js application acts as a proxy server to an external weather API using **Express.js**. It supports:
- **Rate Limiting**: Limits requests to 5 per minute per IP.
- **Caching**: Caches responses for 5 minutes to improve performance.
- **Authentication**: Requires an API key for secure access.
- **Logging**: Logs request details such as timestamp, method, status, response time, and IP address.

---

## **Setup Instructions**

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd <repository-directory>
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Configuration**
Create a `.env` file in the root directory and configure the following:
```bash
PORT=3001
API_KEY=your-secret-api-key
RATE_LIMIT_MAX=5 # requests per minute per IP
CACHE_DURATION=300 # cache duration in seconds (default: 5 minutes)
```

### **4. Start the Server**
```bash
npm start
```

---

## **API Endpoints**

### **Weather Proxy Endpoint**
**GET** `/proxy/weather`

#### **Query Parameters**
- `location` (required): The location to fetch weather data for.
- `apiKey` (required): The API key for authentication.

#### **Example Request:**
```bash
curl "http://localhost:3001/proxy/weather?location=London&apiKey=your-secret-api-key"
```

---

## **Testing the API**

### **1. Test Rate Limiting**
Run the following command 6 times within a minute:
```bash
curl "http://localhost:3001/proxy/weather?location=New%20York&apiKey=your-secret-api-key"
```
- **Expected Result**: 
  - Requests 1 to 5: **200 OK**
  - Request 6: **429 Too Many Requests**

---

### **2. Test Authentication Failure**
```bash
curl "http://localhost:3001/proxy/weather?location=Paris"
```
- **Expected Result**: 
  - **401 Unauthorized** (if API key is missing or invalid).

---

### **3. Test Caching**
1. Send the same request twice:
   ```bash
   curl "http://localhost:3001/proxy/weather?location=Delhi&apiKey=your-secret-api-key"
   ```
2. **Expected Result**:
   - First Request: Normal API response time.
   - Second Request: Faster response due to cached data.

---

## **Caching Mechanism**

### **Cache Key Generation**
A unique cache key is generated using the location:
```javascript
const cacheKey = `weather:${location}`;
```
- Example: **`weather:London`**

### **Cache Retrieval**
```javascript
const cachedData = cache.get(cacheKey);
```
- If cached data exists, it returns the cached response, bypassing the API call:
```javascript
if (cachedData) {
    return res.json(cachedData);
}
```

---

## **Logging Details**
Integrated with **Morgan** for request logging:
- **Method**: HTTP method (GET).
- **URL**: Endpoint path.
- **Status Code**: Response status (200, 429, etc.).
- **Response Time**: Time taken for the request in milliseconds.
- **IP Address**: Client’s IP address.

#### **Example Log:**
```
GET /proxy/weather?location=London 200 123 ms - 127.0.0.1
```

---

## **Handling IPv4 vs IPv6**

By default, the IP address `::1` represents **localhost** in **IPv6**.

### **To Force IPv4:**
- Modify the request to use IPv4:
  ```bash
  curl http://127.0.0.1:3001/proxy/weather?location=London&apiKey=abcd
  ```
- This will display **`127.0.0.1`** instead of **`::1`**.

---

## **Error Handling**

- **Geocode API Errors**: Returns a `500` error if the geocoding service fails.
- **Weather API Errors**: Returns a `500` error if the weather API is unreachable.
- **Rate Limit Exceeded**: Returns a `429 Too Many Requests` error.
- **Authentication Error**: Returns a `401 Unauthorized` error if the API key is missing or invalid.

---

## **License**
This project is licensed under the MIT License.

---

## **Contributing**
Feel free to open a pull request if you'd like to contribute or improve the project! 😊# API_Proxy_Server
