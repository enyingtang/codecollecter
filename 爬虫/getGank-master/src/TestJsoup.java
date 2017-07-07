import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;

import javax.print.Doc;
import javax.xml.bind.Element;
import java.io.*;
import java.util.*;

/**
 * Created by Administrator on 2015/6/10.
 */
public class TestJsoup {
    private static String url = "http://gank.io";
    public static String currentPath = System.getProperty("user.dir");
    public static StringBuffer totalHtml = null;
    public static Map<String,String> titleMap=new HashMap<String,String>();
    public static Date time = new Date(System.currentTimeMillis());
    public static final int StartMonth = 4;
    public static void main(String[] args) {
        createContent(currentPath,"content.txt");
        TestJsoup testJsoup = new TestJsoup();
        List<Document> documents = new ArrayList<Document>();
        documents = testJsoup.getDocuments();
        System.out.println("-----------------------");
        System.out.println("一共" + documents.size() + "个");

        copyFile(currentPath + "\\rawGet.html", currentPath + "\\Get_gank.html");
        System.out.println(currentPath);
        System.out.println(currentPath + "\\rawGet.html");
        System.out.println("333333333333");
        dealFirstHtml();
        System.out.println("titleStrBuf");
        String contentStr = readContent(currentPath+"\\content.txt");
        appendContent(currentPath + "\\Get_gank.html", contentStr, true);

//        for (Document d : documents) {
////            PaThread pa = new PaThread(d);
////            pa.start();
//            dealHtml(d);
//        }
    }

    public static String readContent(String fileName) {
        File file = new File(fileName);
        BufferedReader reader = null;
        StringBuffer titleStrBuf = new StringBuffer();
        try {
            reader = new BufferedReader(new FileReader(file));
            String tempString = null;
            while ((tempString = reader.readLine()) != null) {
                titleStrBuf.append(tempString);
            }
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e1) {
                }
            }
        }
        System.out.println("readContent");
        return titleStrBuf.toString();
    }

    public static void dealFirstHtml() {
        int month = time.getMonth()+1;
        StringBuffer titleContent = new StringBuffer();
        titleContent.append("<div class=\"container content\">");
      for (int i = month; i > StartMonth; i--) {
            titleContent.append("            <h1>"+i+"月</h1>\n" +
                        "            <ul class=\"list\">");
            for (int j = 31; j > 0; j--) {
                String key = "2015/" + i + "/" + j;
                if (titleMap.containsKey(key)) {
                    titleContent.append("<li><a href=\"" + "#" + key + "\">" + titleMap.get(key) + "</a></li>");
                }
            }
            titleContent.append("</ul>");
        }
        titleContent.append("</div>");
        System.out.println("dealFirst");
        appendContent(currentPath + "\\Get_gank.html",titleContent.toString(),true);
    }



    public static void dealHtml(Document document,String tag) {
        Elements ids = document.getElementsByClass("content");
//        org.jsoup.nodes.Element el = ids.get(0).child(0).child(1).child(0).getElementsByTag("a").first();
//        System.out.println("Dealing " + el.attr("href"));
//        String nextlink = el.attr("href");
        StringBuffer getHtml = new StringBuffer();
        getHtml.append("<div class=\"container content\"><h1 id=\""+tag+"\">");
        getHtml.append(ids.get(0).child(1).html());
        titleMap.put(tag, ids.get(0).child(1).text());
        System.out.println(ids.get(0).child(1).text());
        getHtml.append("</h1><hr>");
        getHtml.append("<div class=\"outlink\">");
        getHtml.append(ids.get(0).child(3).html());
        getHtml.append("</div></div>");
//        System.out.println("---------------------");
//        System.out.println(getHtml.toString());
//        System.out.println("---------------------");
        appendContent(currentPath+"\\content.txt",getHtml.toString(),true);
    }


    public static void createContent(String currentPath, String fileName) {

        try {
            File path = new File(currentPath);
            File dir = new File(path, fileName);
            if (!dir.exists()) {
                dir.createNewFile();
            }else {
                appendContent(currentPath+fileName,"",false);
            }
        } catch (Exception e) {
            System.out.print("创建失败");
        }
    }
    public static void appendContent(String fileName, String content,Boolean isAppend) {
        try {
            //打开一个写文件器，构造函数中的第二个参数true表示以追加形式写文件
            FileWriter writer = new FileWriter(fileName, isAppend);
            writer.write(content);
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    public static void copyFile(String oldPath, String newPath) {
        try {
            int bytesum = 0;
            int byteread = 0;
            File oldfile = new File(oldPath);
            if (oldfile.exists()) { //文件存在时
                InputStream inStream = new FileInputStream(oldPath); //读入原文件
                FileOutputStream fs = new FileOutputStream(newPath);
                byte[] buffer = new byte[1444];
                int length;
                while ((byteread = inStream.read(buffer)) != -1) {
                    bytesum += byteread; //字节数 文件大小
                    fs.write(buffer, 0, byteread);
                }
                inStream.close();
            }
        } catch (Exception e) {
            System.out.println("复制单个文件操作出错");
            e.printStackTrace();

        }
    }
    public List<Document> getDocuments() {
        int date, month;
        month = time.getMonth()+1;
        date = time.getDate()-1;//从昨天开始
        System.out.println("当前日期:"+month+"/"+(date+1));
        List<Document> documents = new ArrayList<Document>();
        Document doc = null;
        System.out.println("--------开始抓取------------");
        try {
            doc = Jsoup.connect(url).get();
            documents.add(doc);
            System.out.println("Downloading Document-------/2015/"+month+"/"+(date+1));
            dealHtml(doc,"/2015/"+month+"/"+(date+1));
        } catch (IOException e) {
            e.printStackTrace();
        }
        for (int i = month; i >StartMonth; i--) {
            for (int j = date; j >0 ; j--) {
                try {

                    doc = Jsoup.connect(url+"/2015/"+i+"/"+j).get();
                    documents.add(doc);
                    System.out.println("Downloading Document-------/2015/"+i+"/"+j);
                    dealHtml(doc,"2015/"+i+"/"+j);
                } catch (IOException e) {
                    continue;
//                    e.printStackTrace();
                }

            }
            date = 31;
        }
        System.out.println("--------结束抓取------------");
        return documents;
    }
/*    private static class PaThread extends Thread {
        private Document document;

        public PaThread() {
        }
        public PaThread(Document document) {
            this.document = document;
        }

        @Override
        public void run() {



        }
    }*/
}
