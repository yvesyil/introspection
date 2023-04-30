package ie.tus.introspection;

import java.sql.Connection;
import java.sql.DriverManager;

public class DatabaseFactory {

    static public Connection getHSQLDBConnection(String username, String password) throws Exception {
        Class.forName("org.hsqldb.jdbc.JDBCDriver");
        String url = "jdbc:hsqldb:hsql://localhost:9001/xdb";
        Connection connection = DriverManager.getConnection(url, username, password);
        return connection;
    }

    static public Connection getMYSQLConnection(String username, String password) throws Exception {
        Class.forName("com.mysql.cj.jdbc.JDBCDriver");
        String url = "jdbc:mysql://localhost:3306/fs";
        Connection connection = DriverManager.getConnection(url, username, password);
        return connection;
    }
}
