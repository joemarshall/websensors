# taken from http://www.piware.de/2011/01/creating-an-https-server-in-python/
# generate server.xml with the following command:
#    openssl req -new -x509 -keyout server.pem -out server.pem -days 365 -nodes
# run as follows:
#    python simple-https-server.py
# then in your browser, visit:
#    https://localhost:4443

PORT=8000
USE_HTTPS=False

#PORT=443
#USE_HTTPS=True

from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl
HTTPServer.allow_reuse_address = True
print(f"Start server on port {PORT}, use https:{USE_HTTPS}")
httpd = HTTPServer(('192.168.1.109',PORT), SimpleHTTPRequestHandler)
if USE_HTTPS:
    httpd.socket = ssl.wrap_socket (httpd.socket, certfile='./server.pem', server_side=True)
httpd.serve_forever()